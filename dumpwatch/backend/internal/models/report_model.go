package models

type Report struct {
	ReportId         int
	CreatedById      int
	CreatedDate      string
	LastModifiedDate string
	Description      string
	PlaceDetailId    int
	ImageURL         string
}