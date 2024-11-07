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

var CreateUsers = `CREATE TABLE Users (
    Email VARCHAR(255) NOT NULL PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    First VARCHAR(100) NOT NULL,
    Last VARCHAR(100),
    Zipcode VARCHAR(20)
);`

var InsertUsers = `INSERT INTO Users 
	VALUES 
		('jaxon.fielding@gmail.com', 'complexPW', 'Jaxon', 'Fielding', '26505'),
		('landonurcho17@gmail.com', 'landtest', 'Landon', 'Urcho', '15243'),
		('test1g@yahoo.com', 'test1', 'test1first', 'test1last', '89273'),
		('test2g@hotmail.com', 'test1', 'test2first', 'test2last', '51823-2030')`

var WipeUsers = `TRUNCATE TABLE [dbo].[Users];`

var DropUsers = `DROP TABLE if exists Users;`

func UserCreate(w http.ResponseWriter, r *http.Request) {
	fmt.Println("recieved create request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	u := User{}
	u.Email = r.FormValue("email")
	u.Password = r.FormValue("password")
	u.First = r.FormValue("first")
	// TODO Save to database
}

func UserLogin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("recieved create request")
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
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(&u)
}
