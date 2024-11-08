package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	mssql "github.com/microsoft/go-mssqldb"
	"golang.org/x/crypto/bcrypt"
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
		fmt.Println("Error parsing form: ", err)
		return
	}

	// Intialize User object
	u := User{
		Email:    r.FormValue("email"),
		Password: r.FormValue("password"),
		First:    r.FormValue("first"),
	}

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
	fmt.Println("User object initalized")

	// TODO Save to database -> send the new user obejct to the Datase in SQL

	// Hash PW
	hashedPW, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error hashing password: ", err)
		return
	}

	// Prepared statement to avoid SQL injection
	stmt, err := db.Prepare("INSERT INTO [dbo].[Users] VALUES (@Email, @Password, @First, @Last, @Zipcode)")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error preparing statement: ", err)
		return
	}
	defer stmt.Close()

	// Execute prepared statement with user input
	_, err = stmt.Exec(
		sql.Named("Email", u.Email),
		sql.Named("Password", hashedPW),
		sql.Named("First", u.First),
		sql.Named("Last", u.Last),
		sql.Named("Zipcode", u.Zipcode),
	)

	if err != nil {
		// Handle primary key violation (email already exists)
		var sqlErr *mssql.Error
		if errors.As(err, &sqlErr) {
			if sqlErr.Number == 2627 { // SQL Server error code for primary key violation
				w.WriteHeader(http.StatusConflict) // 409 Conflict
				fmt.Println("Email already exists:", u.Email)
				return
			}
		}
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error executing statement:", err)
		return
	}

	u.Password = "" // Clear password before sending back to client

	w.WriteHeader(http.StatusCreated) // 201
	json.NewEncoder(w).Encode(&u)

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
