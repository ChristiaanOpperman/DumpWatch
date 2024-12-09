package models

type User struct {
	UserId     string
	UserType   string
	Name       *string
	Category   *string
	FirstName  *string
	LastName   *string
	Email      string
	CreatedDate string
}
