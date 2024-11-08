package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Create user struct
type User struct {
	Email       string
	Password    string
	First, Last string
	Zipcode     string
}

// SQL command to create Users table
var CreateUsers = `CREATE TABLE Users (
    Email VARCHAR(255) NOT NULL PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    First VARCHAR(100) NOT NULL,
    Last VARCHAR(100),
    Zipcode VARCHAR(20)
);`

// SQL command for insert user value into table
var InsertUsers = `INSERT INTO Users 
	VALUES 
		('jaxon.fielding@gmail.com', 'complexPW', 'Jaxon', 'Fielding', '26505'),
		('landonurcho17@gmail.com', 'landtest', 'Landon', 'Urcho', '15243'),
		('test1g@yahoo.com', 'test1', 'test1first', 'test1last', '89273'),
		('test2g@hotmail.com', 'test1', 'test2first', 'test2last', '51823-2030')`

// SQL command to wipe Users table
var WipeUsers = `TRUNCATE TABLE [dbo].[Users];`

// SQL command to remove Resorts table
var DropUsers = `DROP TABLE if exists Users;`

// Function to take value from front end and create new entry in Users
func UserCreate(w http.ResponseWriter, r *http.Request) {
	fmt.Println("recieved create request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Intialize User object
	u := User{}
	u.Email = r.FormValue("email")
	u.Password = r.FormValue("password")
	u.First = r.FormValue("first")

	if r.FormValue("last") != "" {
		u.Last = r.FormValue("last")
	} else {
		u.Last = ""
	}

	if r.FormValue("zipcode") != "" {
		u.Zipcode = r.FormValue("zipcode")
	} else {
		u.Zipcode = ""
	}

	// TODO Save to database

	// send the new user obejct to the Datase in SQL
	//
	// Essentially, run the create user flag with a custom SQL command obtained from front end
	// Rename var InsertUser
	// run InsertUsers (from populate flag function)
	InsertUsers = InsertUserCreateQuery(u)
	// Now not sure where to go once I have renamed InsertUsers.
	// 		Do I need to establish another connection to the database, and if so how do i do that securely

	// _, err = db.ExecContext(ctx, InsertUsers)
	// 	if err != nil {
	// 		log.Fatalf("Failed to populate Users database: %v", err)
	// 	}
	// 	fmt.Println("Populated User database successfully.")

}

func InsertUserCreateQuery(u User) string {
	query := fmt.Sprintf(
		`INSERT INTO Users VALUES
		(email, password, first, last, zipcode) VALUES ('%s', '%s', '%s', '%s', '%s');`,
		u.Email, u.Password, u.First, u.Last, u.Zipcode,
	)
	return query
}

// Function to take value from front end and check against existing Users credentials
func UserLogin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("recieved Login request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	email := r.FormValue("email")
	passwd := r.FormValue("password")

	// TODO Convert to prepared statement
	rows, err := db.Query(fmt.Sprintf("SELECT * FROM [dbo].[Users] WHERE Email = '%s';", email))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized) // TODO Correct error (server error)
		return
	}
	if !rows.Next() {
		w.WriteHeader(http.StatusUnauthorized) // TODO Verify error code
		return
	}

	u := User{}
	err = rows.Scan(&u.Email, &u.Password, &u.First, &u.Last, &u.Zipcode) // Returns good or not good
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized) // TODO Correct error (server error)
		return
	}

	if u.Password != passwd {
		w.WriteHeader(http.StatusUnauthorized) // Unauthorized if not matched
		fmt.Println("Invalid Login Request")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(&u)
}
