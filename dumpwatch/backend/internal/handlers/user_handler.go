package handlers

import (
	"crypto/rand"
	"crypto/subtle"
	"database/sql"
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"encoding/base64"
	"log"
	"net/http"
	"os"
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

	log.Printf("User: %v", user)

	hash, err := GeneratePasswordHash(password)
	if err != nil {
		log.Printf("Password hashing error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}

	// Prepare the query and arguments based on the UserType
	var query string
	var args []interface{}

	query = `INSERT INTO User (UserTypeId, Email, PasswordHash, Name )
				VALUES (?, ?, ?, ?)`
	args = []interface{}{
		user.UserTypeId,
		user.Email,
		hash,
		user.Name,
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
	
	encodedHash := base64.StdEncoding.EncodeToString(append(salt, hash...))
	return encodedHash, nil
}

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func Login(c *gin.Context) {
	var user models.User
	var userType models.UserType

	// Bind JSON input
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	email := user.Email
	password := user.Password

	// Query database for user
	row := config.DB.QueryRow(`
		SELECT u.UserId, u.PasswordHash, u.UserTypeId, ut.UserType, ut.Category 
		FROM User u 
		JOIN UserType ut ON u.UserTypeId = ut.UserTypeId
		WHERE u.Email = ?`, email)

	var storedHash string
	if err := row.Scan(&user.UserId, &storedHash, &user.UserTypeId, &userType.UserType, &userType.Category); err != nil {
		if err == sql.ErrNoRows {
			log.Printf("User not found: %s", email)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}

	// Verify password
	if !checkPasswordHash(password, storedHash) {
		log.Printf("Invalid password for user: %s", email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.UserId,
		"exp":    time.Now().Add(24 * time.Hour).Unix(), // Token expires in 24 hours
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		log.Printf("Failed to generate token for user: %s", email)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Successful login response
	log.Printf("User logged in successfully: %s", email)
	c.JSON(http.StatusOK, gin.H{
		"token":    tokenString,
		"userId":   user.UserId,
		"userType": userType.UserType,
	})
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
