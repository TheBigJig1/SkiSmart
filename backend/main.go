// Go connection Sample Code:
package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net/http"

	_ "github.com/microsoft/go-mssqldb"
)

// Connection arguments
var db *sql.DB
var server = "cs3301.database.windows.net"
var port = 1433
var user = ""
var password = ""
var database = "CS_330_1"

// Create user struct
type User struct {
	Email       string
	Password    string
	First, Last string
	Zipcode     string
}

func main() {
	// Establish up Database connection
	flag.StringVar(&password, "password", "", "password")
	flag.StringVar(&user, "user", "cs330admin", "user")
	flag.IntVar(&port, "port", 1433, "port")
	flag.Parse()

	// Build connection string
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d;database=%s;",
		server, user, password, port, database)
	var err error
	// Create connection pool
	db, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Error creating connection pool: ", err.Error())
	}
	ctx := context.Background()
	err = db.PingContext(ctx)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Printf("Connected!")

	// Start web server
	mux := http.NewServeMux()
	mux.HandleFunc("/user/create", UserCreate)
	mux.HandleFunc("/user/login", UserLogin)
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}
	log.Println("Listening...")
	server.ListenAndServe() // Run the http server

}

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
