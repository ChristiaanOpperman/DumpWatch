package models

import (
	"crypto/rand"
	"encoding/base64"
	"strings"

	"golang.org/x/crypto/argon2"
)

type User struct {
	UserId     int    `json:"userId"`
	UserTypeId int    `json:"userTypeId"`
	Name       string `json:"name,omitempty"`
	Email      string `json:"email"`
	Password   string `json:"password,omitempty"`
}

type UserType struct {
	UserTypeId int    `json:"userTypeId"`
	UserType   string `json:"userType"`
	Category   string `json:"category"`
}

func HashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	if err != nil {
		return "", err
	}
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return base64.RawStdEncoding.EncodeToString(salt) + "$" + base64.RawStdEncoding.EncodeToString(hash), nil
}

func VerifyPassword(hash, password string) bool {
	parts := strings.Split(hash, "$")
	if len(parts) != 2 {
		return false
	}
	salt, err := base64.RawStdEncoding.DecodeString(parts[0])
	if err != nil {
		return false
	}
	expectedHash, err := base64.RawStdEncoding.DecodeString(parts[1])
	if err != nil {
		return false
	}
	newHash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return string(expectedHash) == string(newHash)
}
