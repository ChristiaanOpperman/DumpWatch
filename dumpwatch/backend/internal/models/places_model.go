package models

type Place struct {
	PlaceId     int    `json:"placeId"`
	CountryCode string `json:"countryCode"`
	PlaceName   string `json:"placeName"`
}

type PlaceDetail struct {
	PlaceDetailId int     `json:"placeDetailId"`
	PlaceId       int     `json:"placeId"`
	PlaceName     string  `json:"placeName"`
	PostalCode    string  `json:"postalCode"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	Accuracy      *int    `json:"accuracy,omitempty"`
	Place         Place   `json:"place"`
}

type UserPlaceDetail struct {
	UserPlaceDetailsId int         `json:"userPlaceDetailsId"`
	UserId             int         `json:"userId"`
	PlaceDetailId      int         `json:"placeDetailId"`
	CreatedDate        string      `json:"createdDate"`
	PlaceDetail        PlaceDetail `json:"placeDetail"`
}
