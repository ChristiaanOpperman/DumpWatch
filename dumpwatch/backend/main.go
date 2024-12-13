package main

import (
	"dumpwatch/config"
	"dumpwatch/internal/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// 2. Initialise the database
	config.InitDB()

	// 3. Create a new Gin router (replaces http.ServeMux)
	router := gin.Default()

	// 4. Enable CORS
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}
		c.Next()
	})

	// 5. Register the routes from routes/routes.go
	routes.RegisterRoutes(router)

	// 6. Serve static files for uploads
	localUploadsPath := "./uploads"
	if _, err := os.Stat(localUploadsPath); os.IsNotExist(err) {
		log.Fatalf("The specified path does not exist: %s", localUploadsPath)
	}
	log.Printf("Serving files from local path: %s", localUploadsPath)
	router.Static("/uploads", localUploadsPath)

	// 7. Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
