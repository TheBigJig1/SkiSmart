package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"time"

	"github.com/golang-jwt/jwt"

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

// JWT secret key
var jwtKey = []byte("SBk@1c$km3@nrdt")

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

	fmt.Println("User created in DB successfully")
	w.WriteHeader(http.StatusCreated) // 201
	json.NewEncoder(w).Encode(&u)

}

// Function to take value from front end and check against existing Users credentials
func UserLogin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("recieved Login request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error parsing form: ", err)
		return
	}

	email := r.FormValue("email")
	passwd := r.FormValue("password")

	// Create prepared statement stmt
	stmt, err := db.Prepare("SELECT * FROM [dbo].[Users] WHERE Email = @Email")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error preparing statement: ", err)
		return
	}
	defer stmt.Close()

	// Execute prepared statement
	row := stmt.QueryRow(sql.Named("Email", email))

	u := User{}
	err = row.Scan(&u.Email, &u.Password, &u.First, &u.Last, &u.Zipcode) // Returns good or not good
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Println("Email does not exist: ", email)
			return
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}
	}

	// Compare hashed password
	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(passwd))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("Invalid password for user: ", email)
		return
	}

	// Passwords match - Clear password before sending back to client
	u.Password = ""

	// Generate JWT Token
	expirationTime := time.Now().Add(1 * time.Hour) // Login valid for 1 hour
	claims := &jwt.StandardClaims{
		Subject:   u.Email,
		ExpiresAt: expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error generating token: :, err")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := map[string]interface{}{
		"token": tokenString,
		"user": map[string]string{
			"email":   u.Email,
			"first":   u.First,
			"last":    u.Last,
			"zipcode": u.Zipcode,
		},
	}

	log.Println("User logged in successfully")
	json.NewEncoder(w).Encode(response)
}
