package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"encoding/json"
	"net/http"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO User (UserId, UserType, Name, Category, FirstName, LastName, Email) 
	          VALUES (UUID(), ?, ?, ?, ?, ?, ?)`
	_, err = config.DB.Exec(query, user.UserType, user.Name, user.Category, user.FirstName, user.LastName, user.Email)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User created successfully"))
}
