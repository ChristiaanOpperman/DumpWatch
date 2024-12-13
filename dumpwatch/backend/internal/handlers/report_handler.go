package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func CreateReport(c *gin.Context) {
	description := c.PostForm("description")
	latitude := c.PostForm("latitude")
	longitude := c.PostForm("longitude")
	userId := c.PostForm("userId")

	// Get the image from form data
	file, err := c.FormFile("image")
	if err != nil {
		log.Printf("FormFile error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrieve image"})
		return
	}

	// Ensure uploads directory exists
	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
		err = os.Mkdir("./uploads", 0755)
		if err != nil {
			log.Printf("Failed to create uploads directory: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create uploads directory"})
			return
		}
	}

	// Save the file to the local file system
	filePath := fmt.Sprintf("./uploads/%s", file.Filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Printf("SaveUploadedFile error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
		return
	}

	// Insert report into the database
	query := `INSERT INTO Report (CreatedById, Description, Latitude, Longitude, ImageURL) VALUES (?, ?, ?, ?, ?)`
	_, err = config.DB.Exec(query, userId, description, latitude, longitude, filePath)
	if err != nil {
		log.Printf("Database insert report error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Report created successfully"})
}

func GetAllReports(c *gin.Context) {
	// Check if DB connection is not nil
	if config.DB == nil {
		log.Println("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	// Query the database to fetch all reports
	rows, err := config.DB.Query(`
		SELECT ReportId, CreatedById, CreatedDate, LastModifiedDate, Description, Latitude, Longitude, ImageURL
		FROM Report;
	`)
	if err != nil {
		log.Printf("Database get report error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
		return
	}
	defer rows.Close()

	// Slice to hold all reports
	var reports []models.Report

	// Iterate over rows and populate the slice
	for rows.Next() {
		var report models.Report
		err := rows.Scan(
			&report.ReportId,
			&report.CreatedById,
			&report.CreatedDate,
			&report.LastModifiedDate,
			&report.Description,
			&report.Latitude,
			&report.Longitude,
			&report.ImageURL,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse reports"})
			return
		}
		reports = append(reports, report)
	}

	if len(reports) == 0 {
		log.Println("No reports found")
	}

	c.JSON(http.StatusOK, reports)
}

func GetReportById(c *gin.Context) {
	reportId := c.Param("reportId")

	// Check if DB connection is not nil
	if config.DB == nil {
		log.Println("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	// Query the database to fetch the report by ReportId
	row := config.DB.QueryRow(`
		SELECT ReportId, CreatedById, CreatedDate, LastModifiedDate, Description, Latitude, Longitude, ImageURL
		FROM Report
		WHERE ReportId = ?;
	`, reportId)

	var report models.Report

	// Scan the single row into the report struct
	err := row.Scan(
		&report.ReportId,
		&report.CreatedById,
		&report.CreatedDate,
		&report.LastModifiedDate,
		&report.Description,
		&report.Latitude,
		&report.Longitude,
		&report.ImageURL,
	)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			log.Printf("No report found with ReportId: %s", reportId)
			c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		} else {
			log.Printf("Database get report by id error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch report by id"})
		}
		return
	}

	// Return the single report as a JSON response
	c.JSON(http.StatusOK, report)
}

