package main

import (
	"dumpwatch/config"
	"dumpwatch/internal/handlers"
	"log"
	"net/http"

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

	// 5. Start the server
	log.Println("Starting server on port 8080...")
	http.ListenAndServe(":8080", enableCORS(mux))
}
