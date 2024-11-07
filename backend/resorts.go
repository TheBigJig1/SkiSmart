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

var DropResorts = `DROP TABLE if exists Resorts`
