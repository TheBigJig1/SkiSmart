package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

// Create feedback struct
type Feedback struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Feedback string `json:"feedback"`
	Rating   int    `json:"rating"`
}

// SQL command to create Feedback table
var CreateFeedback = `CREATE TABLE Feedback (
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Email VARCHAR(255),
	Feedback VARCHAR(1028) NOT NULL,
	Rating INT NOT NULL
);`

// SQL command to wipe Feedback table
var WipeFeedback = `TRUNCATE TABLE [dbo].[Feedback];`

// SQL command to remove Feedback table
var DropFeedback = `DROP TABLE if exists Feedback;`

// Function to take feedback from front end and create new entry in Feedback
func FeedbackAdd(w http.ResponseWriter, r *http.Request) {
	// Server acknowledges request
	fmt.Println("recieved add request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error parsing form: ", err)
		return
	}

	// Set email and rating from form if not-null
	email := "Anonymous"
	if r.FormValue("email") != "" {
		email = r.FormValue("email")
	}
	ratingString := r.FormValue("rating")
	rating, _ := strconv.Atoi(ratingString)

	// Create new feedback object
	feedback := Feedback{
		Email:    email,
		Feedback: r.FormValue("feedback"),
		Rating:   rating,
	}
	fmt.Println("Feedback object intialized")

	// Prepare SQL statement to avoid SQL injection
	stmt, err := db.Prepare("INSERT INTO [dbo].[Feedback] VALUES (@Email, @Feedback, @Rating)")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error preparing statement: ", err)
		return
	}
	defer stmt.Close()

	// Execute prepared statement with user input
	_, _ = stmt.Exec(
		sql.Named("Email", feedback.Email),
		sql.Named("Feedback", feedback.Feedback),
		sql.Named("Rating", feedback.Rating),
	)

	// Server acknowledges success
	fmt.Println("Feedback added successfully")
	w.WriteHeader(http.StatusOK) // 200 OK

}

// Function to grab Feedback from the database and display on the webpage
func FeedbackGet(w http.ResponseWriter, r *http.Request) {
	// Server acknowledges request
	fmt.Println("recieved get request")

	// Query the database for all feedback
	rows, err := db.Query("SELECT * FROM [dbo].[Feedback]")
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Println("No feedback found")
			return
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}
	}

	defer rows.Close()

	// Create slice of feedback objects
	feedbacks := []Feedback{}

	for rows.Next() {
		f := Feedback{}
		if err = rows.Scan(&f.ID, &f.Email, &f.Feedback, &f.Rating); err != nil {
			// ToDo Handle Error
		}
		if f.Rating == 5 {
			feedbacks = append(feedbacks, f)
		}
	}

	// Server acknowledges success
	log.Println("Feedbacks returned successfully")
	_ = json.NewEncoder(w).Encode(feedbacks)
}
