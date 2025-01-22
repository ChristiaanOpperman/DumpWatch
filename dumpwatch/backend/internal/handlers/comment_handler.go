package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateComment(c *gin.Context) {
	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	log.Printf("Comment recevied: %+v", comment)

	if comment.Message == "" || comment.CreatedById == 0 || comment.ReportId == 0 {
		log.Println("Missing required fields: message, userId, or reportId")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields: message, userId, or reportId"})
		return
	}	

	query := `INSERT INTO Comment (CreatedById, Message, ReportId) VALUES (?, ?, ?)`
	_, err := config.DB.Exec(query, comment.CreatedById, comment.Message, comment.ReportId)
	if err != nil {
		log.Printf("Database insert comment error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Comment created successfully"})
}

func GetCommentsByReportId(c *gin.Context) {
	reportId := c.Param("reportId")
	log.Printf("Fetching comments for Report ID: %s", reportId)

	rows, err := config.DB.Query(`
		SELECT CommentId, ReportId, CreatedById, CreatedDate, Message
		FROM Comment
		WHERE ReportId = ?;
	`, reportId)
	if err != nil {
		log.Printf("Database query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var comment models.Comment
		if err := rows.Scan(
			&comment.CommentId,
			&comment.ReportId,
			&comment.CreatedById,
			&comment.CreatedDate,
			&comment.Message); err != nil {
			log.Printf("Error scanning row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse comments"})
			return
		}
		comments = append(comments, comment)
	}

	if len(comments) == 0 {
		log.Println("No comments found for the given Report ID")
	}

	c.JSON(http.StatusOK, comments)
}
