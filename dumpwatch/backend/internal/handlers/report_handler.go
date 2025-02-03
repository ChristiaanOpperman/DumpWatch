package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateReport(c *gin.Context) {
	log.Printf("Hit!")
	description := c.PostForm("description")

	userIdStr := c.PostForm("userId")
	placeDetailIdStr := c.PostForm("placeDetailId")

	userId, err := strconv.Atoi(userIdStr)
	if err != nil || userId <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	placeDetailId, err := strconv.Atoi(placeDetailIdStr)
	if err != nil || placeDetailId <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid place detail ID"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		log.Printf("FormFile error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrieve image"})
		return
	}

	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
		err = os.Mkdir("./uploads", 0755)
		if err != nil {
			log.Printf("Failed to create uploads directory: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create uploads directory"})
			return
		}
	}

	filePath := fmt.Sprintf("./uploads/%s", file.Filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Printf("SaveUploadedFile error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
		return
	}

	log.Printf("userId: %v, placeDetailId: %v, description: %v, filePath: %v", userId, placeDetailId, description, filePath)

	query := `INSERT INTO Report (CreatedById, Description, PlaceDetailId, ImageURL) VALUES (?, ?, ?, ?)`
	_, err = config.DB.Exec(query, userId, description, placeDetailId, filePath)
	if err != nil {
		log.Printf("Database insert report error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Report created successfully"})
}

func GetAllReports(c *gin.Context) {
	if config.DB == nil {
		log.Println("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	rows, err := config.DB.Query(`
		SELECT r.ReportId, r.CreatedById, r.CreatedDate, r.LastModifiedDate, r.Description, r.PlaceDetailId, r.ImageURL,
				pd.PlaceId, pd.PostalCode, pd.Latitude, pd.Longitude, pd.Accuracy,
				p.PlaceName
		FROM Report r
		JOIN PlaceDetails pd ON r.PlaceDetailId = pd.PlaceDetailId
		JOIN Place p ON pd.PlaceId = p.PlaceId
		;
	`)
	if err != nil {
		log.Printf("Database get report error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
		return
	}
	defer rows.Close()

	var reports []models.Report

	for rows.Next() {
		var report models.Report
		err := rows.Scan(
			&report.ReportId,
			&report.CreatedById,
			&report.CreatedDate,
			&report.LastModifiedDate,
			&report.Description,
			&report.PlaceDetailId,
			&report.ImageURL,
			&report.Place.PlaceId,
			&report.PlaceDetail.PostalCode,
			&report.PlaceDetail.Latitude,
			&report.PlaceDetail.Longitude,
			&report.PlaceDetail.Accuracy,
			&report.Place.PlaceName,
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

func GetReportsByPlaceDetailsId(c *gin.Context) {
	placeDetailsIdParam := c.Param("placeDetailsId")
	// print details
	fmt.Printf("placeDetailsIdParam: %s", placeDetailsIdParam)

	placeDetailsId, err := strconv.Atoi(placeDetailsIdParam)
	if err != nil {
		log.Printf("Invalid placeDetailsId: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid placeDetailsId"})
		return
	}

	if config.DB == nil {
		log.Println("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	query := `
		SELECT r.ReportId, r.CreatedById, r.CreatedDate, r.LastModifiedDate, r.Description, r.ImageURL,
		       pd.PlaceDetailId, pd.PlaceId, pd.PostalCode, pd.Latitude, pd.Longitude, pd.Accuracy,
		       p.PlaceName
		FROM Report r
		JOIN PlaceDetails pd ON r.PlaceDetailId = pd.PlaceDetailId
		JOIN Place p ON pd.PlaceId = p.PlaceId
		WHERE r.PlaceDetailId = ?
	`

	rows, err := config.DB.Query(query, placeDetailsId)
	if err != nil {
		log.Printf("Database query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
		return
	}
	defer rows.Close()

	log.Println("Query executed successfully, checking results...")

	var reports []models.Report
	rowCount := 0

	for rows.Next() {
		rowCount++
		var report models.Report
		err := rows.Scan(
			&report.ReportId,
			&report.CreatedById,
			&report.CreatedDate,
			&report.LastModifiedDate,
			&report.Description,
			&report.ImageURL,
			&report.PlaceDetail.PlaceDetailId,
			&report.PlaceDetail.PlaceId,
			&report.PlaceDetail.PostalCode,
			&report.PlaceDetail.Latitude,
			&report.PlaceDetail.Longitude,
			&report.PlaceDetail.Accuracy,
			&report.Place.PlaceName,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue // Don't return, just skip this row
		}
		reports = append(reports, report)
	}

	log.Printf("Total rows retrieved: %d", rowCount)

	if len(reports) == 0 {
		log.Println("No reports found for the given PlaceDetailId")
		c.JSON(http.StatusOK, []models.Report{})
		return
	}

	c.JSON(http.StatusOK, reports)
}

func GetReportById(c *gin.Context) {
	reportId := c.Param("reportId")

	if config.DB == nil {
		log.Println("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	row := config.DB.QueryRow(`
		SELECT r.ReportId, r.CreatedById, r.CreatedDate, r.LastModifiedDate, r.Description, r.ImageURL,
		       pd.PlaceDetailId, pd.PlaceId, pd.PostalCode, pd.Latitude, pd.Longitude, pd.Accuracy,
		       p.PlaceName
		FROM Report r
		JOIN PlaceDetails pd ON r.PlaceDetailId = pd.PlaceDetailId
		JOIN Place p ON pd.PlaceId = p.PlaceId
		WHERE r.ReportId = ?
	`, reportId)

	var report models.Report

	err := row.Scan(
		&report.ReportId,
		&report.CreatedById,
		&report.CreatedDate,
		&report.LastModifiedDate,
		&report.Description,
		&report.ImageURL,
		&report.PlaceDetail.PlaceDetailId,
		&report.PlaceDetail.PlaceId,
		&report.PlaceDetail.PostalCode,
		&report.PlaceDetail.Latitude,
		&report.PlaceDetail.Longitude,
		&report.PlaceDetail.Accuracy,
		&report.Place.PlaceName,
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

	c.JSON(http.StatusOK, report)
}
