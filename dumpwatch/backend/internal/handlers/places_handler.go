package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Get all places
func GetAllPlaces(c *gin.Context) {
	//print you've been hit
	fmt.Println("You've been hit")
	rows, err := config.DB.Query("SELECT PlaceId, CountryCode, PlaceName FROM Place")
	if err != nil {
		log.Printf("Error fetching places: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch places"})
		return
	}
	defer rows.Close()

	var places []models.Place
	for rows.Next() {
		var place models.Place
		err := rows.Scan(&place.PlaceId, &place.CountryCode, &place.PlaceName)
		if err != nil {
			log.Printf("Error scanning place row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse places"})
			return
		}
		places = append(places, place)
	}

	c.JSON(http.StatusOK, places)
}

func GetPlaceDetails(c *gin.Context) {
	placeId := c.Param("placeId")

	if placeId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing placeId parameter"})
		return
	}

	var place models.Place
	err := config.DB.QueryRow("SELECT PlaceId, CountryCode, PlaceName FROM Place WHERE PlaceId = ?", placeId).
		Scan(&place.PlaceId, &place.CountryCode, &place.PlaceName)

	if err != nil {
		log.Printf("Error fetching place: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Place not found"})
		return
	}

	rows, err := config.DB.Query(`
		SELECT PlaceDetailId, PostalCode, Latitude, Longitude, Accuracy 
		FROM PlaceDetails 
		WHERE PlaceId = ?`, placeId)

	if err != nil {
		log.Printf("Error fetching place details: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch place details"})
		return
	}
	defer rows.Close()

	var placeDetails []models.PlaceDetail
	for rows.Next() {
		var detail models.PlaceDetail
		err := rows.Scan(&detail.PlaceDetailId, &detail.PostalCode, &detail.Latitude, &detail.Longitude, &detail.Accuracy)
		if err != nil {
			log.Printf("Error scanning place detail row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse place details"})
			return
		}
		placeDetails = append(placeDetails, detail)
	}

	response := gin.H{
		"place": place,
		"details": placeDetails,
	}

	c.JSON(http.StatusOK, response)
}

// Get place details by latitude and longitude
func GetPlaceByCoordinates(c *gin.Context) {
	lat := c.Query("lat")
	lng := c.Query("lng")

	var placeDetail models.PlaceDetail
	err := config.DB.QueryRow(`
		SELECT PlaceDetailId, PlaceId, PostalCode, Latitude, Longitude, Accuracy 
		FROM PlaceDetails 
		WHERE Latitude = ? AND Longitude = ?`, lat, lng).
		Scan(&placeDetail.PlaceDetailId, &placeDetail.PlaceId, &placeDetail.PostalCode, &placeDetail.Latitude, &placeDetail.Longitude, &placeDetail.Accuracy)

	if err != nil {
		log.Printf("Error fetching place by coordinates: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "No place found for provided coordinates"})
		return
	}

	c.JSON(http.StatusOK, placeDetail)
}

// Create report with place details
func CreateReportWithPlaceDetails(c *gin.Context) {
	description := c.PostForm("description")
	placeId := c.PostForm("placeId")
	postalCode := c.PostForm("postalCode")
	userId := c.PostForm("userId")

	file, err := c.FormFile("image")
	if err != nil {
		log.Printf("FormFile error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrieve image"})
		return
	}

	filePath := "./uploads/" + file.Filename
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Printf("SaveUploadedFile error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
		return
	}

	query := `INSERT INTO Report (UserId, Description, PlaceDetailId, ImageURL) 
	          VALUES (?, ?, (SELECT PlaceDetailId FROM PlaceDetails WHERE PlaceId = ? AND PostalCode = ?), ?)`
	_, err = config.DB.Exec(query, userId, description, placeId, postalCode, filePath)
	if err != nil {
		log.Printf("Database insert report error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save report"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Report created successfully"})
}

func GetUserPlaceDetails(c *gin.Context) {
	userIdParam := c.Param("userId")
	userId, err := strconv.Atoi(userIdParam)
	if err != nil {
		log.Printf("Invalid userId: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
		return
	}

	if config.DB == nil {
		log.Println("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	query := `
		SELECT upd.UserPlaceDetailsId, upd.UserId, upd.PlaceDetailId, upd.CreatedDate,
		       pd.PlaceId, pd.PostalCode, pd.Latitude, pd.Longitude, pd.Accuracy,
		       p.CountryCode, p.PlaceName
		FROM UserPlaceDetail upd
		JOIN PlaceDetails pd ON upd.PlaceDetailId = pd.PlaceDetailId
		JOIN Place p ON pd.PlaceId = p.PlaceId
		WHERE upd.UserId = ?
	`

	rows, err := config.DB.Query(query, userId)
	if err != nil {
		log.Printf("Database query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user place details"})
		return
	}
	defer rows.Close()

	var userPlaceDetails []models.UserPlaceDetail
	for rows.Next() {
		var userPlaceDetail models.UserPlaceDetail
		err := rows.Scan(
			&userPlaceDetail.UserPlaceDetailsId,
			&userPlaceDetail.UserId,
			&userPlaceDetail.PlaceDetailId,
			&userPlaceDetail.CreatedDate,
			&userPlaceDetail.PlaceDetail.PlaceId,
			&userPlaceDetail.PlaceDetail.PostalCode,
			&userPlaceDetail.PlaceDetail.Latitude,
			&userPlaceDetail.PlaceDetail.Longitude,
			&userPlaceDetail.PlaceDetail.Accuracy,
			&userPlaceDetail.PlaceDetail.Place.CountryCode,
			&userPlaceDetail.PlaceDetail.Place.PlaceName,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user place details"})
			return
		}
		userPlaceDetails = append(userPlaceDetails, userPlaceDetail)
	}

	if len(userPlaceDetails) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No user place details found for the given userId"})
		return
	}

	c.JSON(http.StatusOK, userPlaceDetails)
}
