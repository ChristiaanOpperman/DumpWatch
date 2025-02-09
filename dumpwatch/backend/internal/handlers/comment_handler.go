package handlers

import (
	"dumpwatch/config"
	"dumpwatch/internal/models"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateComment(c *gin.Context) {
	var comment models.Comment

	if err := c.ShouldBindJSON(&comment); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	log.Printf("Comment received: %+v", comment)


	if comment.Message == "" || comment.UserId == 0 || comment.ReportId == 0 {
		log.Println("Missing required fields: message, userId, or reportId")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields: message, userId, or reportId"})
		return
	}	

	query := `INSERT INTO Comment (UserId, Message, ReportId) VALUES (?, ?, ?)`
	result, err := config.DB.Exec(query, comment.UserId, comment.Message, comment.ReportId)
	if err != nil {
		log.Printf("Database insert comment error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save comment"})
		return
	}
	commentId, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error retrieving last insert ID: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comment ID"})
		return
	}

	comment.CommentId = int(commentId)
	comment.CreatedDate = time.Now().Format("2006-01-02 15:04:05")

	log.Printf("Comment successfully created: %+v", comment)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Comment created successfully",
		"comment": comment,
	})

}

func GetCommentsByReportId(c *gin.Context) {
	reportId := c.Param("reportId")
	log.Printf("Fetching comments for Report ID: %s", reportId)

	rows, err := config.DB.Query(`
		SELECT CommentId, ReportId, UserId, CreatedDate, Message
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
			&comment.UserId,
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
