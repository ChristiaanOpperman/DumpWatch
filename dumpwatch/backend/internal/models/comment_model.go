package models

type Comment struct {
	CommentId   int    `json:"commentId"`
	UserId      int    `json:"userId"`
	CreatedDate string `json:"createdDate"`
	Message     string `json:"message"`
	ReportId    int    `json:"reportId"`
}