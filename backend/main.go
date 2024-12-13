package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/microsoft/go-mssqldb"
	"github.com/rs/cors"
)

// Connection arguments
var db *sql.DB
var server = "cs3301.database.windows.net"
var dbport = 1433
var hport = 8080
var user = ""
var password = ""
var database = "CS_330_1"
var reactDir = ""

// TODO: Add JWT secret key flag
// var pwHash = "testHash"

func main() {
	// Establish up Database connection
	flag.StringVar(&password, "password", "", "password")
	flag.StringVar(&user, "user", "cs330admin", "user")
	flag.IntVar(&dbport, "dbport", 1433, "port")
	flag.IntVar(&hport, "hport", 8080, "port")
	flag.StringVar(&reactDir, "react-dir", "../dist", "ReactJS path")

	// Optional flags
	createdb := flag.Bool("create-db", false, "initialize DB")
	populatedb := flag.Bool("populate-db", false, "populated DB")
	wipeuserdb := flag.Bool("wipe-users", false, "wiped Users DB")
	wiperesortdb := flag.Bool("wipe-resorts", false, "wiped Resorts DB")
	wipefeedbackdb := flag.Bool("wipe-feedback", false, "wiped Feedback DB")
	dropdb := flag.Bool("drop-db", false, "dropped DB")
	flag.Parse()

	// Build connection string
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d;database=%s;",
		server, user, password, dbport, database)
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

	// Drop all databases flag
	if *dropdb {
		_, err = db.ExecContext(ctx, DropUserBookmarkedResorts)
		if err != nil {
			log.Fatalf("Failed to drop UserBookmarkedResorts database: %v", err)
		}
		fmt.Println("UserBookmarkedResorts Database deleted successfully.")

		_, err = db.ExecContext(ctx, DropUserVisitedResorts)
		if err != nil {
			log.Fatalf("Failed to drop UserVisitedResorts database: %v", err)
		}
		fmt.Println("UserVisitedResorts Database deleted successfully.")

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

		// _, err = db.ExecContext(ctx, DropFeedback)
		// if err != nil {
		// 	log.Fatalf("Failed to drop Feedback database: %v", err)
		// }
		// fmt.Println("Feedback database deleted successfully.")
	}

	// Create whole database flag
	if *createdb {
		_, err = db.ExecContext(ctx, CreateUsers)
		if err != nil {
			log.Printf("Failed to create Users database: %v", err)
		}
		fmt.Println("Users database created successfully.")

		_, err = db.ExecContext(ctx, CreateResorts)
		if err != nil {
			log.Printf("Failed to create Resorts database: %v", err)
		}
		fmt.Println("Resorts database created successfully.")

		_, err = db.ExecContext(ctx, CreateFeedback)
		if err != nil {
			log.Printf("Failed to create Feedback database: %v", err)
		}
		fmt.Println("Feedback database created successfully.")

		_, err = db.ExecContext(ctx, CreateUserBookmarkedResorts)
		if err != nil {
			log.Printf("Failed to create UserBookmarkedResorts database: %v", err)
		}
		fmt.Println("UserBookmarkedResorts database created successfully.")

		_, err = db.ExecContext(ctx, CreateUserVisitedResorts)
		if err != nil {
			log.Printf("Failed to create UserVisitedResorts database: %v", err)
		}
		fmt.Println("UserVisitedResorts database created successfully.")
	}

	// Populate whole DB flag
	if *populatedb {
		_, err = db.ExecContext(ctx, InsertUsers)
		if err != nil {
			log.Printf("Failed to populate Users database: %v", err)
		}
		fmt.Println("Populated User database successfully.")

		_, err = db.ExecContext(ctx, InsertResorts)
		if err != nil {
			log.Printf("Failed to populate Resorts database: %v", err)
		}
		fmt.Println("Populated Resorts database successfully.")

		// Do not need to populate feedback database

		// Do not need to populate UserBookmarkedResorts database

		// Do not need to populate UserVisitedResorts database

	}

	// Flag function to wipe user data
	if *wipeuserdb {
		_, err = db.ExecContext(ctx, DropUserBookmarkedResorts)
		if err != nil {
			log.Fatalf("Failed to find UserBookmarkedResorts database: %v", err)
		}
		fmt.Println("Droped UserBookmarkedResorts database successfully.")

		_, err = db.ExecContext(ctx, DropUserVisitedResorts)
		if err != nil {
			log.Fatalf("Failed to find UserVisitedResorts database: %v", err)
		}
		fmt.Println("Droped UserVisitedResorts database successfully.")

		_, err = db.ExecContext(ctx, WipeUsers)
		if err != nil {
			log.Fatalf("Failed to find User database: %v", err)
		}
		fmt.Println("Wiped Users database successfully.")

		_, err = db.ExecContext(ctx, CreateUserBookmarkedResorts)
		if err != nil {
			log.Printf("Failed to create UserBookmarkedResorts database: %v", err)
		}
		fmt.Println("UserBookmarkedResorts database created successfully.")

		_, err = db.ExecContext(ctx, CreateUserVisitedResorts)
		if err != nil {
			log.Printf("Failed to create UserVisitedResorts database: %v", err)
		}
		fmt.Println("UserVisitedResorts database created successfully.")
	}

	// Flag function to wipe resort data
	if *wiperesortdb {
		_, err = db.ExecContext(ctx, DropUserBookmarkedResorts)
		if err != nil {
			log.Fatalf("Failed to find UserBookmarkedResorts database: %v", err)
		}
		fmt.Println("Droped UserBookmarkedResorts database successfully.")

		_, err = db.ExecContext(ctx, DropUserVisitedResorts)
		if err != nil {
			log.Fatalf("Failed to find UserVisitedResorts database: %v", err)
		}
		fmt.Println("Droped UserVisitedResorts database successfully.")

		_, err = db.ExecContext(ctx, WipeResorts)
		if err != nil {
			log.Fatalf("Failed to find Resorts database: %v", err)
		}
		fmt.Println("Wiped Resorts database successfully.")

		_, err = db.ExecContext(ctx, CreateUserBookmarkedResorts)
		if err != nil {
			log.Printf("Failed to create UserBookmarkedResorts database: %v", err)
		}
		fmt.Println("UserBookmarkedResorts database created successfully.")

		_, err = db.ExecContext(ctx, CreateUserVisitedResorts)
		if err != nil {
			log.Printf("Failed to create UserVisitedResorts database: %v", err)
		}
		fmt.Println("UserVisitedResorts database created successfully.")
	}

	// Flag function to wipe feedback data
	if *wipefeedbackdb {
		_, err = db.ExecContext(ctx, WipeFeedback)
		if err != nil {
			log.Fatalf("Failed to find Feedback database: %v", err)
		}
		fmt.Println("Drop Feedback database successfully.")
	}

	// Start web server - connects backend to npm app / terminal
	mux := http.NewServeMux()

	// Serve static files from the React app
	fs := http.FileServer(http.Dir(reactDir))
	http.Handle("/", fs)

	mux.HandleFunc("api/users/create", UserCreate)
	mux.HandleFunc("/users/login", UserLogin)
	mux.HandleFunc("/users/logout", UserLogout)
	mux.HandleFunc("/feedback/add", FeedbackAdd)
	mux.HandleFunc("/feedback/list", FeedbackList)
	mux.HandleFunc("/resorts/list", ResortPreviewList)
	mux.HandleFunc("/resorts/get", ResortGet)
	mux.HandleFunc("/users/togglebookmark", ToggleUserBookmark)
	mux.HandleFunc("/users/loadbookmarks", GetBookmarks)
	// mux.HandleFunc("/snow-data", SnowData)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Serve API routes
		if strings.HasPrefix(r.URL.Path, "/users/") ||
			strings.HasPrefix(r.URL.Path, "/feedback/") ||
			strings.HasPrefix(r.URL.Path, "/resorts/") {
			mux.ServeHTTP(w, r)
			return
		}

		// Construct the full file path
		path := filepath.Join(reactDir, r.URL.Path)

		// Check if the file exists
		_, err := os.Stat(path)
		if os.IsNotExist(err) || r.URL.Path == "/" {
			// If the file doesn't exist or path is root, serve index.html for client-side routing
			path = filepath.Join(reactDir, "index.html")
		}

		// Get the file extension to determine the MIME type
		ext := filepath.Ext(path)
		mimeType := mime.TypeByExtension(ext)

		// Set the Content-Type header
		w.Header().Set("Content-Type", mimeType)

		// Serve the file
		http.ServeFile(w, r, path)
	})

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://172.174.105.76:5173"}, // HACK: Frontend origin and VM
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	})

	handler := corsHandler.Handler(mux)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", hport),
		Handler: handler,
	}

	log.Println("Listening...")
	if err = server.ListenAndServe(); err != nil {
		fmt.Println(err)
	}

}
