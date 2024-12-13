package routes

import (
	"dumpwatch/internal/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	// Routes for Reports
	router.POST("/create-report", handlers.CreateReport)
	router.GET("/get-reports", handlers.GetAllReports)
	router.GET("/get-report-by-reportId/:reportId", handlers.GetReportById)

	// Routes for Comments
	router.GET("/get-comments-by-reportId/:reportId", handlers.GetCommentsByReportId)
	router.POST("/create-comment", handlers.CreateComment)

	// Routes for Users
	router.POST("/create-user", handlers.CreateUser)
}