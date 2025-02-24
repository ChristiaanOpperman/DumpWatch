package main

import (
	"dumpwatch/config"
	"dumpwatch/internal/routes"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/andybalholm/brotli"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// brotliWriter wraps the gin.ResponseWriter and writes compressed output.
type brotliWriter struct {
	gin.ResponseWriter
	writer *brotli.Writer
}

// Override Write to compress data before writing.
func (w *brotliWriter) Write(data []byte) (int, error) {
	return w.writer.Write(data)
}

// BrotliMiddleware compresses HTTP responses if the client supports Brotli ("br").
func BrotliMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if the client supports Brotli.
		if !strings.Contains(c.Request.Header.Get("Accept-Encoding"), "br") {
			c.Next()
			return
		}

		// Set the Content-Encoding header and wrap the response writer.
		c.Header("Content-Encoding", "br")
		bw := brotli.NewWriter(c.Writer)
		defer bw.Close()
		c.Writer = &brotliWriter{ResponseWriter: c.Writer, writer: bw}
		c.Next()
	}
}

// CacheControlHandler serves static files with Cache-Control and Expires headers.
func CacheControlHandler(root string) gin.HandlerFunc {
	fs := http.FileServer(http.Dir(root))
	return func(c *gin.Context) {
		// Set headers for long-term caching (1 year).
		c.Writer.Header().Set("Cache-Control", "public, max-age=31536000")
		expires := time.Now().AddDate(1, 0, 0).Format(http.TimeFormat)
		c.Writer.Header().Set("Expires", expires)

		// Remove the /uploads/ prefix so that FileServer can locate the file.
		http.StripPrefix("/uploads/", fs).ServeHTTP(c.Writer, c.Request)
	}
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	config.InitDB()

	router := gin.Default()

	// Apply Brotli compression globally.
	router.Use(BrotliMiddleware())

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

	routes.RegisterRoutes(router)

	localUploadsPath := "./uploads"
	if _, err := os.Stat(localUploadsPath); os.IsNotExist(err) {
		log.Fatalf("The specified path does not exist: %s", localUploadsPath)
	}
	log.Printf("Serving files from local path: %s", localUploadsPath)
	router.GET("/uploads/*filepath", CacheControlHandler(localUploadsPath))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
