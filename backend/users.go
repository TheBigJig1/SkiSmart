package main

import (
	"encoding/json"
	"log/slog"
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
    Last VARCHAR(100) NOT NULL,
    Zipcode VARCHAR(20) NOT NULL
);`

var DropUsers = `DROP TABLE Users;`

func UserCreate(w http.ResponseWriter, r *http.Request) {
	slog.Info("recieved create request")
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
	slog.Info("recieved create request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
	// email := r.FormValue("email")
	// passwd := r.FormValue("password")

	user, ok := User{}, true
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	// if user.Password != passwd {
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	return
	// }
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(&user)
}
