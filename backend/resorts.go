package main

// Create resort struct

type Resort struct {
	ID        int
	Name      string
	Address   string
	Lat, Long float32
}

// SQL command to create Resorts table
var CreateResorts = `CREATE TABLE Resorts (
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
	Zipcode VARCHAR(20) NOT NULL,
    Lat FLOAT(32) NOT NULL,
	Long FLOAT(32) NOT NULL,
	INDEX idx_Name (Name),
	INDEX idx_Zipcode (Zipcode)
);`

// SQL command for insert resort value into table
var InsertResorts = `INSERT INTO Resorts 
	VALUES 
		('The Wisp', '296 Marsh Hill Rd, McHenry, MD', '21541', 39.0430555556, -79.3988888889),
		('Seven Springs', '777 Waterwheel Dr, Champion, PA', '15622', 40.0222222222, -79.2972222222),
		('Timberline', '254 Four Seasons Dr, Davis, WV', '26260', 39.1125, -79.3963888889)`

// SQL command to wipe Resorts table
var WipeResorts = `TRUNCATE TABLE [dbo].[Resorts];`

// SQL command to remove Resorts table
var DropResorts = `DROP TABLE if exists Resorts`
