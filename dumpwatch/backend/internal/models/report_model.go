package models

type Report struct {
	ReportId         int          `json:"reportId"`
	CreatedById      int          `json:"createdById"`
	CreatedDate      string       `json:"createdDate"`
	LastModifiedDate string       `json:"lastModifiedDate"`
	Description      string       `json:"description"`
	PlaceDetailId    int          `json:"placeDetailId"`
	ImageURL         string       `json:"imageUrl"`
	PlaceDetail      PlaceDetail  `json:"placeDetail"`
	Place            Place        `json:"place"`
}