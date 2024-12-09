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
    err := godotenv.Load(".env")
    if err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }

    config.InitDB()

    mux := http.NewServeMux()

    mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		if r.Method == http.MethodPost {
			handlers.CreatePost(w, r)
		} else if r.Method == http.MethodGet {
			handlers.GetAllPosts(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

    log.Println("Starting server on port 8080...")
    http.ListenAndServe(":8080", enableCORS(mux))
}
