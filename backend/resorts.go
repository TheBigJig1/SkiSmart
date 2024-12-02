package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

// Create resort struct

type Resort struct {
	ID        int
	Name      string
	Address   string
	Zipcode   string
	Lat       float32
	Long      float32
	ImageLink string
}

// SQL command to create Resorts table
var CreateResorts = `CREATE TABLE Resorts (
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
	Zipcode VARCHAR(20) NOT NULL,
    Lat FLOAT(32) NOT NULL,
	Long FLOAT(32) NOT NULL,
	ImageLink VARCHAR(255) NOT NULL,
	INDEX idx_Name (Name),
	INDEX idx_Zipcode (Zipcode)
);`

// SQL command for insert resort value into table
var InsertResorts = `INSERT INTO Resorts 
	VALUES 
		('The Wisp', '296 Marsh Hill Rd, McHenry, MD', '21541', 39.556649, -79.363863, 'https://d15zjc2r4e8kr7.cloudfront.net/8517/blog/IMG_2822.jpg'),
		('Seven Springs', '777 Waterwheel Dr, Champion, PA', '15622', 40.022944, -79.298111, 'https://scene7.vailresorts.com/is/image/vailresorts/20221004_SS_Lewis_1:Featured-Content-AND-Sliding-Cards-AND-Container-Long-Amount?resMode=sharp2&w=855&h=480&wid=392&fit=constrain,1&dpr=on,2.625'),
		('Timberline', '254 Four Seasons Dr, Davis, WV', '26260', 39.041790, -79.399686, 'https://elkinsrandolphwv.com/wp-content/uploads/2020/10/Timberline-1568x1045.jpg'),
		('Snowshoe', '10 Snowshoe Dr, Snowshoe, WV', '26209', 38.402509, -79.993196, 'https://i0.wp.com/mountaintopcondos.com/wp-content/uploads/2024/09/image-4-scaled-1.jpg?fit=2560%2C1920&ssl=1'),
		('Vail', '390 Interlocken Cres, Broomfield', '80021', 39.605487, -106.355284, 'https://www.travelandleisure.com/thmb/YFdvTj2kKw5qIWLMVhSbFhcs6qA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/skiing-vail-mountain-colorado-MMVAIL1221-1543ad9d836f403989991d357e2467de.jpg'),
		('Breckenridge', '1599 Ski Hill Rd, Breckenridge, CO', '80424', 39.478028, -106.075305, 'https://scene7.vailresorts.com/is/image/vailresorts/20200609_BR_VailInternal_001:Featured-Stories?resMode=sharp2&w=526&h=350&wid=382&fit=constrain,1&dpr=on,2.625'),
		('Keystone', '100 Dercum Square, Keystone, CO', '80435', 39.557807, -105.909964, 'https://skibookings.com/wp-content/uploads/RR-Winter-Night.jpg')`

// SQL command to wipe Resorts table
var WipeResorts = `TRUNCATE TABLE [dbo].[Resorts];`

// SQL command to remove Resorts table
var DropResorts = `DROP TABLE if exists Resorts`

// Function to grab Resorts from DB and display on webpage
func ResortPreviewList(w http.ResponseWriter, r *http.Request) {
	// Server acknowledges request
	fmt.Println("recieved list request")

	// Get query parameters
	values := r.URL.Query()

	// Convert to int, check error
	limit := values.Get("limit")
	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	fmt.Print(" Limit: ", limitInt)

	// Get user Zip code
	userZip := values.Get("zip")
	fmt.Printf(" User Zip: %v\n", userZip)
	userZipInt, err := strconv.Atoi(userZip)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Create prepared statement stmt for query parameters
	stmt, err := db.Prepare("SELECT * FROM resorts ORDER BY ABS(zipcode - @UserZip) OFFSET 0 ROWS FETCH NEXT @Limit ROWS ONLY")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error preparing statement: ", err)
		return
	}
	defer stmt.Close()

	// Query the database for all feedback
	rows, err := stmt.Query(sql.Named("UserZip", userZipInt), sql.Named("Limit", limitInt))
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Println("No resorts found")
			return
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}
	}
	defer rows.Close()

	// Create slice of resorts
	resorts := []Resort{}

	// Iterate through rows and append to slice
	for rows.Next() {
		rl := Resort{}
		if err = rows.Scan(&rl.ID, &rl.Name, &rl.Address, &rl.Zipcode, &rl.Lat, &rl.Long, &rl.ImageLink); err != nil {
			fmt.Println("Error scanning row: ", err)
			return
		}
		resorts = append(resorts, rl)
	}

	// Server acknowledges success
	log.Println("Resort List returned successfully")
	w.WriteHeader(http.StatusOK) // 200 OK
	_ = json.NewEncoder(w).Encode(&resorts)
}

// Function to get get a single resort from the DB
func ResortGet(w http.ResponseWriter, r *http.Request) {
	// Server acknowledges request
	fmt.Println("recieved get request")

	// Get name parameter
	name := r.URL.Query().Get("name")

	// Create prepared statement stmt for query parameters
	stmt, err := db.Prepare("SELECT * FROM [dbo].[Resorts] WHERE Name = @Name")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error preparing statement: ", err)
		return
	}
	defer stmt.Close()

	// Execute prepared statement
	row := stmt.QueryRow(sql.Named("Name", name))

	fmt.Printf("SQL query: %v\n", row)

	// Create resort struct
	tr := Resort{}

	// Scan row into resort struct
	err = row.Scan(&tr.ID, &tr.Name, &tr.Address, &tr.Zipcode, &tr.Lat, &tr.Long, &tr.ImageLink)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Println("Resort not found")
			return
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}
	}

	// Server acknowledges success
	log.Println("Resort returned successfully")
	w.WriteHeader(http.StatusOK) // 200 OK
	_ = json.NewEncoder(w).Encode(&tr)
}
