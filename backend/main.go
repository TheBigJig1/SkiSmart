// Go connection Sample Code:
package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
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

func main() {
	// Establish up Database connection
	flag.StringVar(&password, "password", "", "password")
	flag.StringVar(&user, "user", "cs330admin", "user")
	flag.IntVar(&port, "port", 1433, "port")
	createdb := flag.Bool("create-db", false, "initialize DB")
	populatedb := flag.Bool("populate-db", false, "populated DB")
	wipedb := flag.Bool("wipe-db", false, "wiped DB")
	dropdb := flag.Bool("drop-db", false, "dropped DB")
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
	fmt.Println("Connected!")

	// Drop all databases
	if *dropdb {
		_, err = db.ExecContext(ctx, DropUsers)
		if err != nil {
			log.Fatalf("Failed to drop Users database: %v", err)
		}
		fmt.Println("Users Database deleted successfully.")

		_, err = db.ExecContext(ctx, DropResorts)
		if err != nil {
			log.Fatalf("Failed to drop Resorts database: %v", err)
		}
		fmt.Println("Resorts database deleted successfully.")
	}

	// Create whole database
	if *createdb {
		_, err = db.ExecContext(ctx, CreateUsers)
		if err != nil {
			log.Fatalf("Failed to create Users database: %v", err)
		}
		fmt.Println("Users database created successfully.")

		_, err = db.ExecContext(ctx, CreateResorts)
		if err != nil {
			log.Fatalf("Failed to create Resorts database: %v", err)
		}
		fmt.Println("Resorts database created successfully.")
	}

	// Populate whole DB
	if *populatedb {
		_, err = db.ExecContext(ctx, InsertUsers)
		if err != nil {
			log.Fatalf("Failed to populate Users database: %v", err)
		}
		fmt.Println("Populated User database successfully.")
	}

	// TODO add function to wipe user data
	if *wipedb {
		_, err = db.ExecContext(ctx, WipeUsers)
		if err != nil {
			log.Fatalf("Failed to find User database: %v", err)
		}
		fmt.Println("Wiped Users database successfully.")

		_, err = db.ExecContext(ctx, WipeResorts)
		if err != nil {
			log.Fatalf("Failed to find Resorts database: %v", err)
		}
		fmt.Println("Wiped Resorts database successfully.")

	}

	// Start web server - connects backend to npm app
	mux := http.NewServeMux()
	mux.HandleFunc("/users/create", UserCreate)
	mux.HandleFunc("/users/login", UserLogin)
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}
	log.Println("Listening...")
	server.ListenAndServe() // Run the http server

}
