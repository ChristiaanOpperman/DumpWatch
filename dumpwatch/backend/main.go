package main

import (
	"dumpwatch/config"
	"dumpwatch/internal/handlers"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// 1. Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// 2. Initialise the database
	config.InitDB()

	// 3. Create the ServeMux (router)
	mux := http.NewServeMux()

	// 4. Register the routes (imported from handlers/routes.go)
	handlers.RegisterRoutes(mux)

	/// 4.5 Use the local file system to serve files
	localUploadsPath := "./uploads" // <-- Change this path to the folder on your local machine
	if _, err := os.Stat(localUploadsPath); 
	os.IsNotExist(err) {
		log.Fatalf("The specified path does not exist: %s", localUploadsPath)
	}

	log.Printf("Serving files from local path: %s", localUploadsPath)

	// 4.6 Serve the static files directly from the local file system
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(localUploadsPath))))

	// 5. Start the server
	log.Println("Starting server on port 8080...")
	if err := http.ListenAndServe(":8080", enableCORS(mux)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
