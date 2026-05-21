package config

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	constStr := "host=localhost port=5432 user=postgres password=karan dbname=studentdb sslmode=disable"
	db, err := sql.Open("postgres", constStr)
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	fmt.Println("---------- db connected successfully -----")

	DB = db

}
