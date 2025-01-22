package models

type Comment struct {
	CommentId   int
	CreatedById int
	CreatedDate string
	Message     string
	ReportId    int
}
