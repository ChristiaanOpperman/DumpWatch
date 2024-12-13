package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	query := `INSERT INTO User (UserId, UserType, Name, Category, FirstName, LastName, Email) 
	          VALUES (UUID(), ?, ?, ?, ?, ?, ?)`
	_, err := config.DB.Exec(query, user.UserType, user.Name, user.Category, user.FirstName, user.LastName, user.Email)
	if err != nil {
		log.Printf("Database insert user error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}
