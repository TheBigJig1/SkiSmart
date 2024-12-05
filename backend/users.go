package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"time"

	"github.com/golang-jwt/jwt"

	mssql "github.com/microsoft/go-mssqldb"
	"golang.org/x/crypto/bcrypt"
)

// Create user struct
type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	First    string `json:"first"`
	Last     string `json:"last"`
	Zipcode  string `json:"zipcode"`
}

type UserClaims struct {
	User User `json:"user"`
	jwt.StandardClaims
}

// SQL command to create Users table
var CreateUsers = `CREATE TABLE Users (
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    First VARCHAR(100) NOT NULL,
    Last VARCHAR(100),
    Zipcode VARCHAR(20)
);`

// SQL command to create UserBookmarkedResorts table
var CreateUserBookmarkedResorts = `CREATE TABLE UserBookmarkedResorts (
	UserID_FK INT NOT NULL,
	ResortID_FK INT NOT NULL,
	PRIMARY KEY (UserID_FK, ResortID_FK),
	FOREIGN KEY (UserID_FK) REFERENCES Users(ID),
	FOREIGN KEY (ResortID_FK) REFERENCES Resorts(ID),
	INDEX idx_ResortID (ResortID_FK)
);`

// SQL command to create UserVisitedResorts table
var CreateUserVisitedResorts = `CREATE TABLE UserVisitedResorts (
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	UserID_FK INT NOT NULL FOREIGN KEY REFERENCES Users(ID),
	ResortID_FK INT NOT NULL FOREIGN KEY REFERENCES Resorts(ID),
	VisitedDate DATE NOT NULL,
	INDEX idx_ResortID (ResortID_FK),
	INDEX idx_VisitedID (VisitedDate),
	INDEX idx_UserID (UserID_FK)
);`

// SQL command for insert user value into table
var InsertUsers = `INSERT INTO Users 
	VALUES 
		('jaxon.fielding@gmail.com', '` + encryptPW("complexPW") + `', 'Jaxon', 'Fielding', '26505'),
		('landonurcho71@gmail.com', '` + encryptPW("landtest") + `', 'Landon', 'Urcho', '15243'),
		('test1g@yahoo.com', '` + encryptPW("test1test") + `', 'test1first', 'test1last', '89273'),
		('test2g@hotmail.com', '` + encryptPW("test2test") + `', 'test2first', 'test2last', '51823-2030')`

// SQL command to wipe Users table + UserBookmarkedResorts + UserVisitedResorts
var WipeUsers = `TRUNCATE TABLE [dbo].[Users];`
var WipeUserBookmarkedResorts = `TRUNCATE TABLE [dbo].[UserBookmarkedResorts];`
var WipeUserVisitedResorts = `TRUNCATE TABLE [dbo].[UserVisitedResorts];`

// SQL command to remove Resorts table  + UserBookmarkedResorts + UserVisitedResorts
var DropUsers = `DROP TABLE if exists Users;`
var DropUserBookmarkedResorts = `DROP TABLE if exists UserBookmarkedResorts;`
var DropUserVisitedResorts = `DROP TABLE if exists UserVisitedResorts;`

// JWT secret key
var jwtKey = []byte("SBk@1c$km3@nrdt")

func encryptPW(pwd string) string {

	hashedPW, _ := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
	return string(hashedPW)
}

// Function to take value from front end and create new entry in Users
func UserCreate(w http.ResponseWriter, r *http.Request) {
	fmt.Println("recieved create request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error parsing form: ", err)
		return
	}

	// Convert fullname to first and last name
	parts := strings.Split(r.FormValue("fullname"), " ")
	first := parts[0]
	last := ""

	if len(parts) > 0 {
		last = parts[1]
	}

	// Intialize User object
	u := User{
		Email:    r.FormValue("email"),
		Password: r.FormValue("password"),
		First:    first,
		Last:     last,
		Zipcode:  r.FormValue("zipcode"),
	}
	fmt.Println("User object initalized")

	// Hash PW
	hashedPW := encryptPW(u.Password)

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
	w.WriteHeader(http.StatusOK) // 200 OK
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

	loginEmail := r.FormValue("email")
	loginPassword := r.FormValue("password")

	// Create prepared statement stmt
	stmt, err := db.Prepare("SELECT * FROM [dbo].[Users] WHERE Email = @Email")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error preparing statement: ", err)
		return
	}
	defer stmt.Close()

	// Execute prepared statement
	row := stmt.QueryRow(sql.Named("Email", loginEmail))

	u := User{}
	err = row.Scan(&u.ID, &u.Email, &u.Password, &u.First, &u.Last, &u.Zipcode) // Returns good or not good
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Println("Email does not exist: ", loginEmail)
			return
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}
	}

	// Compare hashed password
	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(loginPassword))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("Invalid password for user: ", loginEmail)
		return
	}

	// Passwords match - Clear password before sending back to client
	u.Password = ""

	// Generate JWT Token
	expirationTime := time.Now().Add(6 * time.Hour) // Login valid for 1 hour
	claims := &UserClaims{
		StandardClaims: jwt.StandardClaims{
			Subject:   u.Email,
			ExpiresAt: expirationTime.Unix(),
		},
		User: u,
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

	// TODO undo response embedding
	response := map[string]interface{}{
		"token": tokenString,
	}

	// Report successful login, eat error
	log.Println("User logged in successfully")
	_ = json.NewEncoder(w).Encode(response)
}

// In case something needs cleaned up server side
// TODO: revoke JWT token
func UserLogout(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	bearer := r.Header.Get("Authorization")

	if !strings.HasPrefix(bearer, "Bearer ") {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("Invalid token")
		return
	}

	token := strings.TrimPrefix(bearer, "Bearer ")

	t, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Invalid token or Error Parsing: ", err)
		return
	}

	// Eat error, we don't care if it fails
	u := t.Claims.(jwt.MapClaims)["user"]
	b, _ := json.MarshalIndent(u, "", "  ")

	user := User{}
	_ = json.Unmarshal(b, &user) // Eat error

	log.Printf("User logged out successfully: %v\n", user)
}

// I need to send the user ID and resort ID to the backend

// Function to create a new user Bookmark in the UserBookmarkedResorts table
func ToggleUserBookmark(w http.ResponseWriter, r *http.Request) {

	// Acknowledge request
	fmt.Println("recieved Bookmark request")
	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error parsing form: ", err)
		return
	}

	// Check if user is logged in
	// Think I can handle it here by allowing the front end to send null token
	bearer := r.Header.Get("Authorization")
	if !strings.HasPrefix(bearer, "Bearer ") {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("Invalid token")
		return
	}

	t := strings.TrimPrefix(bearer, "Bearer ")
	if t == "" {
		w.WriteHeader(http.StatusUnprocessableEntity)
		fmt.Println("Empty token")
		return
	}

	// Parse form
	// Get token from form
	token, err := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Invalid token or Error Parsing: ", err)
		return
	}

	// Create user object from token
	u := token.Claims.(jwt.MapClaims)["user"]
	b, _ := json.MarshalIndent(u, "", "  ")

	user := User{}
	_ = json.Unmarshal(b, &user) // Eat error
	uid := user.ID

	// Get resort ID from curResortID
	body, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error parsing resort ID: ", err)
		return
	}

	var requestBody struct {
		ResortID int `json:"resortID"`
	}
	if err := json.Unmarshal(body, &requestBody); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error unmarshalling request body: ", err)
		return
	}

	rid := requestBody.ResortID

	fmt.Printf("USER: %d, RESORT: %d\n", uid, rid)

	// Check if user has already bookmarked this resort
	var exists bool
	query := `SELECT 1 FROM UserBookmarkedResorts WHERE UserID_FK = @p1 AND ResortID_FK = @p2`
	_ = db.QueryRow(query, sql.Named("p1", uid), sql.Named("p2", rid)).Scan(&exists)

	// if yes, remove bookmark from table
	if exists {
		_, err = db.Exec(`DELETE FROM UserBookmarkedResorts WHERE UserID_FK = @p1 AND ResortID_FK = @p2`, sql.Named("p1", uid), sql.Named("p2", rid))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error deleting bookmark: ", err)
			return
		}
		fmt.Println("Bookmark removed successfully")
	} else { // if no, add bookmark to table
		_, err = db.Exec(`INSERT INTO UserBookmarkedResorts (UserID_FK, ResortID_FK) VALUES (@p1, @p2)`, sql.Named("p1", uid), sql.Named("p2", rid))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error adding bookmark: ", err)
			return
		}
		fmt.Println("Bookmark added successfully")
	}

	// Acknowledge success
	w.WriteHeader(http.StatusOK)
}

// Function to retrieve all bookmarks for a user
func GetBookmarks(w http.ResponseWriter, r *http.Request) {
	// Acknowledge request
	fmt.Println("recieved GetBookmarks request")

	if err := r.ParseForm(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error parsing form: ", err)
		return
	}

	// Verify User is logged in
	bearer := r.Header.Get("Authorization")
	if !strings.HasPrefix(bearer, "Bearer ") {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("Invalid token")
		return
	}

	t := strings.TrimPrefix(bearer, "Bearer ")
	if t == "" {
		w.WriteHeader(http.StatusUnprocessableEntity)
		fmt.Println("Empty token")
		return
	}

	// Parse form
	// Get token from form
	token, err := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Invalid token or Error Parsing: ", err)
		return
	}

	// Create user object from token
	u := token.Claims.(jwt.MapClaims)["user"]
	b, _ := json.MarshalIndent(u, "", "  ")

	user := User{}
	_ = json.Unmarshal(b, &user) // Eat error
	uid := user.ID

	// Query UserBookmarkedResorts table for all bookmarks for this user
	rows, err := db.Query(`SELECT ResortID_FK FROM UserBookmarkedResorts WHERE UserID_FK = @p1`, sql.Named("p1", uid))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error querying bookmarks: ", err)
		return
	}

	// Create slice of resorts
	resorts := []Resort{}

	// Get resorts where ID matches bookmarked ID
	for rows.Next() {
		var rid int
		err = rows.Scan(&rid)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}

		// Query Resorts table for resort information
		row := db.QueryRow(`SELECT * FROM Resorts WHERE ID = @p1`, sql.Named("p1", rid))

		rl := Resort{}
		err = row.Scan(&rl.ID, &rl.Name, &rl.Address, &rl.Zipcode, &rl.Lat, &rl.Long, &rl.HomeLink, &rl.CameraLink, &rl.ImageLink)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}

		resorts = append(resorts, rl)
	}

	// Server acknowledges success
	log.Println("Bookmark List returned successfully")
	w.WriteHeader(http.StatusOK) // 200 OK
	_ = json.NewEncoder(w).Encode(&resorts)

}
