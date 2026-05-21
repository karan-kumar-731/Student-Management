package main

import (
	"net/http"
	"os"
	"student-crud/config"
	"student-crud/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	// connect database
	config.Connect()

	// create gin router
	router := gin.Default()

	// cors middleware
	router.Use(func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// routes
	routes.StudentsRoutes(router)

	// render dynamic port
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	// run server
	router.Run(":" + port)
}