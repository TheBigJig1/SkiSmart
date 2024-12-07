package main

import (
	"fmt"
	"log"
	"net/http"
)

func TemperatureData(w http.ResponseWriter, r *http.Request) {
	collection := r.URL.Query().Get("collection")
	url := fmt.Sprintf("https://planetarycomputer.microsoft.com/api/stac/v1/collections/%s", collection)

	resource, err := stac.Fetch(r.Context(), url, nil)
	if err != nil {
		log.Fatalf("Failed to fetch STAC resource: %v", err)
	}

	collection, ok := resource.(*stac.Collection)
	if !ok {
		log.Fatalf("Fetched resource is not a STAC Collection")
	}

	// Print out some basic metadata
	fmt.Printf("Collection ID: %s\n", collection.ID)
	fmt.Printf("Title: %s\n", collection.Title)
	fmt.Printf("Description: %s\n", collection.Description)
	fmt.Printf("License: %s\n", collection.License)

	// Print spatial extent if available
	if collection.Extent != nil && collection.Extent.Spatial != nil {
		fmt.Printf("Spatial Extent: %+v\n", collection.Extent.Spatial.BBox)
	}

	// Print links associated with the collection
	fmt.Println("Links:")
	for _, link := range collection.Links {
		fmt.Printf(" - Rel: %s, Href: %s\n", link.Rel, link.Href)
	}

}
