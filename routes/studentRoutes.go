package routes

import (
	"student-crud/controller"

	"github.com/gin-gonic/gin"
)

func StudentsRoutes(c *gin.Engine) {
	c.POST("/student", controller.CreateStudent)
	c.GET("/get/students", controller.GetAllStudents)
	c.PUT("/update/student/:id", controller.UpdateStudent)
	c.DELETE("/delete/student/:id", controller.DeleteStudent)
	c.GET("/student/:id", controller.GetStudentById)
}
