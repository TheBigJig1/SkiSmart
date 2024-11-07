package main

// Create resort struct

type Resort struct {
	ID        int
	Name      string
	Address   string
	Lat, Long float32
}

var CreateResorts = `CREATE TABLE Resorts (
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Lat FLOAT(32) NOT NULL,
	Long FLOAT(32) NOT NULL
);`

// TODO add insert resort SQL code
var InsertResorts = `INSERT INTO Resorts 
	VALUES 
		('Wisp', '296 Marsh Hill Rd, McHenry, MD 21541', 39.3329, 79.2147)`

var WipeResorts = `TRUNCATE TABLE [dbo].[Resorts];`

var DropResorts = `DROP TABLE if exists Resorts`
