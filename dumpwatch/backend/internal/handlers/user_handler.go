package handlers

import (
	"crypto/rand"
	"crypto/subtle"
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"encoding/base64"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/argon2"
)

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Extract password and generate the hash
	password := user.Password
	if password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	hash, err := GeneratePasswordHash(password)
	if err != nil {
		log.Printf("Password hashing error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}

	// Prepare the query and arguments based on the UserType
	var query string
	var args []interface{}

	if user.UserType == "Community" {
		query = `INSERT INTO User (UserType, Email, PasswordHash, FirstName, LastName)
		         VALUES (?, ?, ?, ?, ?)`
		args = []interface{}{
			user.UserType,
			user.Email,
			hash,
			user.FirstName,
			user.LastName,
		}
	} else if user.UserType == "Organisation" {
		query = `INSERT INTO User (UserType, Email, PasswordHash, OrganisationName, Category)
		         VALUES (?, ?, ?, ?, ?)`
		args = []interface{}{
			user.UserType,
			user.Email,
			hash,
			user.OrganisationName,
			user.Category,
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}

	// Execute the query
	_, err = config.DB.Exec(query, args...)
	if err != nil {
		log.Printf("Database insert user error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func GeneratePasswordHash(password string) (string, error) {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	if err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	// Encode salt and hash together
	encodedHash := base64.StdEncoding.EncodeToString(append(salt, hash...))
	return encodedHash, nil
}

var jwtSecret = []byte("a98c46ee53a279e26f583bae2393d50c5b3c8cef0d4d8eec27171e25132841c1")

func Login(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	email := user.Email
	password := user.Password

	row := config.DB.QueryRow(`SELECT UserId, PasswordHash FROM User WHERE Email = ?`, email)
	var storedHash string
	if err := row.Scan(&user.UserId, &storedHash); err != nil {
		log.Printf("User not found: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Verify password
	if !checkPasswordHash(password, storedHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.UserId,
		// "exp":    time.Now().Add(15 * time.Second).Unix(), // Token expires in 15 seconds
		"exp":    time.Now().Add(24 * time.Hour).Unix(), // Token expires in 24 hours
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func checkPasswordHash(password, encodedHash string) bool {
	// Decode the stored hash
	decodedHash, err := base64.StdEncoding.DecodeString(encodedHash)
	if err != nil {
		return false // Invalid encoded hash
	}

	// Split the hash into components: salt and the actual hash
	salt, hash := decodedHash[:16], decodedHash[16:]

	// Regenerate the hash using the password and the salt
	computedHash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)

	// Compare the computed hash with the stored hash
	return subtle.ConstantTimeCompare(computedHash, hash) == 1
}
