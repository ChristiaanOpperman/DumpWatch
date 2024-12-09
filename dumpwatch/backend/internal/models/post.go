package models

type PostReport struct {
	PostId           string
	CreatedById      string
	CreatedDate      string
	LastModifiedById string
	LastModifiedDate string
	Description      string
	Latitude         float64
	Longitude        float64
	ImageURL         string
}
