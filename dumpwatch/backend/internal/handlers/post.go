package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func CreatePost(w http.ResponseWriter, r *http.Request) {
    err := r.ParseMultipartForm(10 << 20) // Limit upload to 10MB
    if err != nil {
        log.Printf("ParseMultipartForm error: %v", err)
        http.Error(w, "Unable to parse form", http.StatusBadRequest)
        return
    }

    description := r.FormValue("description")
    latitude := r.FormValue("latitude")
    longitude := r.FormValue("longitude")
    userId := r.FormValue("userId")

    file, handler, err := r.FormFile("image")
    if err != nil {
        log.Printf("FormFile error: %v", err)
        http.Error(w, "Unable to retrieve image", http.StatusBadRequest)
        return
    }
    defer file.Close()

    // Ensure uploads directory exists
    if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
        err = os.Mkdir("./uploads", 0755)
        if err != nil {
            log.Printf("Failed to create uploads directory: %v", err)
            http.Error(w, "Unable to create uploads directory", http.StatusInternalServerError)
            return
        }
    }

    // Save the file to the local file system
    filePath := fmt.Sprintf("./uploads/%s", handler.Filename)
    out, err := os.Create(filePath)
    if err != nil {
        log.Printf("Create file error: %v", err)
        http.Error(w, "Unable to save image", http.StatusInternalServerError)
        return
    }
    defer out.Close()

    _, err = io.Copy(out, file)
    if err != nil {
        log.Printf("Copy file error: %v", err)
        http.Error(w, "Failed to save file", http.StatusInternalServerError)
        return
    }

    query := `INSERT INTO PostReport (CreatedById, Description, Latitude, Longitude, ImageURL) VALUES (?, ?, ?, ?, ?)`
    _, err = config.DB.Exec(query, userId, description, latitude, longitude, filePath)
    if err != nil {
        log.Printf("Database insert error: %v", err)
        http.Error(w, "Failed to save post", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    w.Write([]byte("Post created successfully"))
}
func GetAllPosts(w http.ResponseWriter, r *http.Request) {
	// Query the database to fetch all posts
	rows, err := config.DB.Query(`
		SELECT PostId, CreatedById, CreatedDate, LastModifiedById, LastModifiedDate, Description, Latitude, Longitude, ImageURL
		FROM PostReport
	`)
	if err != nil {
		http.Error(w, "Failed to fetch posts", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Slice to hold all posts
	var posts []models.PostReport

	// Iterate over rows and populate the slice
	for rows.Next() {
		var post models.PostReport
		err := rows.Scan(
			&post.PostId,
			&post.CreatedById,
			&post.CreatedDate,
			&post.LastModifiedById,
			&post.LastModifiedDate,
			&post.Description,
			&post.Latitude,
			&post.Longitude,
			&post.ImageURL,
		)
		if err != nil {
			http.Error(w, "Failed to parse posts", http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	// Convert the slice to JSON and send it in the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}
