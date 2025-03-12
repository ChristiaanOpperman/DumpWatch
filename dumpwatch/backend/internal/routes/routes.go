package routes

import (
	"dumpwatch/internal/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	// Report routes
	router.POST("/create-report", handlers.CreateReport)
	router.PUT("/set-report-status", handlers.SetReportStatus)
	router.GET("/get-reports", handlers.GetAllReports)
	router.GET("/get-report-by-reportId/:reportId", handlers.GetReportById)
	router.GET("/get-reports-by-place-details-id/:placeDetailsId", handlers.GetReportsByPlaceDetailsId)

	// Place routes
	router.GET("/get-places", handlers.GetAllPlaces)
	router.GET("/get-place-by-coordinates", handlers.GetPlaceByCoordinates)
	router.GET("/get-place-details/:placeId", handlers.GetPlaceDetails)
	router.GET("/get-user-place-details/:userId", handlers.GetUserPlaceDetails)
	router.POST("/create-user-place-detail", handlers.CreateUserPlaceDetail)

	// Comments routes
	router.GET("/get-comments-by-reportId/:reportId", handlers.GetCommentsByReportId)
	router.POST("/create-comment", handlers.CreateComment)

	// User routes
	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)
}