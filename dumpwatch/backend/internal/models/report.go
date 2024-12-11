package models

type Report struct {
	ReportId         string
	CreatedById      string
	CreatedDate      string
	LastModifiedDate string
	Description      string
	Latitude         float64
	Longitude        float64
	ImageURL         string
}