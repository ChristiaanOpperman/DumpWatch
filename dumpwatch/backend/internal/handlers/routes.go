package handlers

import (
	"net/http"
)

func RegisterRoutes(mux *http.ServeMux) {
	// Create Post Route
	mux.HandleFunc("/create-report", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		CreateReport(w, r)
	})

	// Get Posts Route
	mux.HandleFunc("/get-reports", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		GetAllReports(w, r)
	})

	// Create User Route
	mux.HandleFunc("/create-user", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		CreateUser(w, r)
	})
}
