package controller

import (
	"net/http"
	"student-crud/config"
	"student-crud/models"

	"github.com/gin-gonic/gin"
)

func CreateStudent(r *gin.Context) {
	var student models.Student

	err := r.ShouldBindJSON(&student)
	if err != nil {
		r.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request",
		})
		return
	}

	query := `INSERT INTO users(name,email,age) VALUES($1,$2,$3)`

	_, err = config.DB.Exec(query, student.Name, student.Email, student.Age)

	if err != nil {
		r.JSON(http.StatusBadRequest, gin.H{
			"message": "failed to create student",
		})
		return
	}

	r.JSON(http.StatusOK, gin.H{
		"message": "student craeted",
		"student": student,
	})

}

//get function

func GetAllStudents(r *gin.Context) {
	//studs slices for store students in a slice
	var studs []models.Student

	//query to get studnets details
	query := `SELECT id,name,email,age FROM users`

	// executing query and fetching data and storing them in rows and err if any
	rows, err := config.DB.Query(query)

	//error handling
	if err != nil {
		r.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}
	defer rows.Close()

	//reading next row
	for rows.Next() {
		var student models.Student

		//scan data into struct
		err := rows.Scan(&student.ID, &student.Name, &student.Email, &student.Age)
		if err != nil {
			r.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
			})
			return
		}

		studs = append(studs, student)

	}

	r.JSON(http.StatusOK, gin.H{
		"message":  "fetched data successfully!",
		"students": studs,
	})

}

//update student by id

func UpdateStudent(r *gin.Context) {
	//extract id from api
	id := r.Param("id")
	var student models.Student

	err := r.ShouldBindJSON(&student)
	if err != nil {
		r.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request",
		})
		return
	}

	// update query
	query := `UPDATE users SET name=$1,email=$2,age=$3 WHERE id=$4`

	//execute query
	result, err := config.DB.Exec(query, student.Name, student.Email, student.Age, id)

	if err != nil {
		r.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to update",
		})
		return
	}

	rowsAffected, err := result.RowsAffected()

	if err != nil {
		r.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to check updated rows",
		})
		return
	}

	if rowsAffected == 0 {
		r.JSON(http.StatusNotFound, gin.H{
			"message": "student not found of that id",
		})
		return
	}

	r.JSON(http.StatusOK, gin.H{
		"message": "student updated successfully",
		"student": student,
	})

}

//delete function for deleting the student data

func DeleteStudent(r *gin.Context) {
	id := r.Param("id")

	query := `DELETE FROM users WHERE id=$1`
	result, err := config.DB.Exec(query, id)

	if err != nil {
		r.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request",
		})
		return
	}

	rowAffected, err := result.RowsAffected()

	if err != nil {
		r.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to check deleted row",
		})
		return
	}
	if rowAffected == 0 {
		r.JSON(http.StatusNotFound, gin.H{
			"message": "student not found",
		})
		return
	}

	r.JSON(http.StatusOK, gin.H{
		"message": "student deleted successfuly",
	})

}


// get student by id

func GetStudentById(r *gin.Context) {

	id := r.Param("id")

	var student models.Student

	query := `SELECT id,name,email,age FROM users WHERE id=$1`

	data := config.DB.QueryRow(query, id)

	err := data.Scan(
		&student.ID,
		&student.Name,
		&student.Email,
		&student.Age,
	)

	if err != nil {
		r.JSON(http.StatusNotFound, gin.H{
			"message": "student not found",
		})
		return
	}

	r.JSON(http.StatusOK, gin.H{
		"message": "student found",
		"student": student,
	})
}