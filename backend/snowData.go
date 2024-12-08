// This didnt work, but I think it was close. I was trying to get the snow data from the Microsoft Planetary Computer API

package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"os"
	"strings"
	"time"
)

// https://planetarycomputer.microsoft.com/docs/reference/stac/
// TODO: incomplete but sufficient
type SearchParams struct {
	Collections []string  `json:"collections"`
	Bbox        []float64 `json:"bbox"`
	DateTime    string    `json:"datetime"` // "2020-01-01T00:00:00Z/2020-01-02T00:00:00Z"
	Limit       int       `json:"limit"`
}

type Bbox []float64

const DAY = 24 * time.Hour

var BBOXES = map[string][]float64{
	"WV":    {-85.0, 35.0, -75.0, 42.0},                // Bounding box for West Virginia and surrounding area
	"US":    {-125.0, 24.396308, -66.93457, 49.384358}, // Approximate bounding box for the contiguous USA
	"US-NW": {-125.0, 47.0, -123.0, 49.0},              // NW tip of continental US
}

// URL to the STAC collection on the Microsoft Planetary Computer:
// collections: modis-10A1-061, noaa-nclimgrid-monthly
func SnowData(w http.ResponseWriter, r *http.Request) {
	search := flag.String("search", "https://planetarycomputer.microsoft.com/api/stac/v1/search", "URL to the STAC search endpoint")
	day := flag.String("day", time.Now().Add(-7.*DAY).Format("2006-01-02"), "Day to search for")
	collections := flag.String("collections", "modis-10A1-061", "Comma-separated list of collections to search")
	bbox := flag.String("bbox", "US", "Bounding box to search")
	limit := flag.Int("limit", 1, "Limit the number of results")
	debug := flag.Bool("debug", false, "Enable debug output")
	flag.Parse()
	// incomplete but sufficient
	params := SearchParams{
		Collections: strings.Split(*collections, ","),
		Bbox:        BBOXES[*bbox],
		DateTime:    fmt.Sprintf("%sT00:00:00Z/%sT23:59:59Z", *day, *day),
		Limit:       *limit,
	}
	rbody, _ := json.Marshal(&params)
	cl := &http.Client{}
	req, err := http.NewRequest("POST", *search, bytes.NewReader(rbody))
	if err != nil {
		log.Fatalf("Failed to make STAC request: %v", err)
	}
	if *debug {
		rqRaw, _ := httputil.DumpRequestOut(req, true)
		os.Stderr.Write(rqRaw)
		os.Stderr.Write([]byte("\n"))
	}
	// Fetch the collection from the remote STAC endpoint
	rsp, err := cl.Do(req)
	if err != nil {
		log.Fatalf("Failed to fetch STAC resource: %v", err)
	}
	defer rsp.Body.Close()

	raw, _ := io.ReadAll(rsp.Body)
	if *debug {
		_, _ = os.Stdout.Write(raw)
	}

	fc := FeatureCollection{}
	if err := json.NewDecoder(bytes.NewBuffer(raw)).Decode(&fc); err != nil {
		log.Fatalf("Failed to unmarshal STAC resource: %v", err)
	}

	if len(fc.Features) == 0 {
		log.Print("No features found in STAC response")
		return
	}

	fmt.Fprintf(os.Stderr, "Found %s collection with %d features\n", fc.Type, len(fc.Features))

	// item := fc.Features[0]
	// asset_key := maps.Keys(item.Assets)
	// signed_href := asset_key // TODO sign this

	// raw, _ := json.MarshalIndent(&fc.Features[0], "", "  ")
	// os.Stdout.Write(raw)

	// for _, feat := range fc.Features {
	// 	raw, _ := json.MarshalIndent(&feat, "", "  ")
	// 	os.Stdout.Write(raw)
	// }

	avgTemps := []AverageTemp{}
	// TODO convert temps here
	_ = json.NewEncoder(os.Stdout).Encode(avgTemps)
}

// https://planetarycomputer.microsoft.com/docs/quickstarts/reading-stac/#Manually-signing-assets
func Sign(cl *http.Client, url, collection string) (string, error) {
	rsp, err := cl.Get(fmt.Sprintf("https://planetarycomputer.microsoft.com/api/sas/v1/token/%s", collection))
	if err != nil {
		return "", fmt.Errorf("failed to fetch SAS token: %v", err)
	}
	tmp := map[string]interface{}{}
	if err := json.NewDecoder(rsp.Body).Decode(&tmp); err != nil {
		return "", fmt.Errorf("failed to unmarshal SAS token: %v", err)
	}
	token, ok := tmp["token"].(string)
	if !ok {
		return "", fmt.Errorf("failed to extract SAS token")
	}
	return fmt.Sprintf("%s?%s", url, token), nil
}

type AverageTemp struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	AvgTemp   float64 `json:"avg_temp"`
}

type FeatureCollection struct {
	Type     string    `json:"type"`
	Features []Feature `json:"features"`
	Links    []Link    `json:"links"`
}

type Feature struct {
	ID          string            `json:"id"`
	BBox        []float64         `json:"bbox"`
	Type        string            `json:"type"`
	Links       []Link            `json:"links"`
	Assets      map[string]Asset  `json:"assets"`
	Geometry    Geometry          `json:"geometry"`
	Collection  string            `json:"collection"`
	Properties  FeatureProperties `json:"properties"`
	Extensions  []string          `json:"stac_extensions"`
	StacVersion string            `json:"stac_version"`
}

type Link struct {
	Rel    string      `json:"rel"`
	Type   string      `json:"type,omitempty"`
	Href   string      `json:"href"`
	Method string      `json:"method,omitempty"`
	Body   interface{} `json:"body,omitempty"`
	Title  string      `json:"title,omitempty"`
}

type Asset struct {
	Href        string       `json:"href"`
	Type        string       `json:"type"`
	Roles       []string     `json:"roles"`
	Title       string       `json:"title"`
	RasterBands []RasterBand `json:"raster:bands,omitempty"`
	Classes     []Class      `json:"classification:classes,omitempty"`
}

type RasterBand struct {
	Scale             *float64 `json:"scale,omitempty"`
	DataType          string   `json:"data_type"`
	SpatialResolution *int     `json:"spatial_resolution,omitempty"`
}

type Class struct {
	Value       int    `json:"value"`
	Description string `json:"description"`
}

type Geometry struct {
	Type        string        `json:"type"`
	Coordinates [][][]float64 `json:"coordinates"`
}

type FeatureProperties struct {
	Created             string    `json:"created"`
	Updated             string    `json:"updated"`
	Datetime            *string   `json:"datetime"` // nullable
	Platform            string    `json:"platform"`
	ProjEPSG            *int      `json:"proj:epsg"` // nullable if needed
	ProjWKT2            string    `json:"proj:wkt2"`
	ProjShape           []int     `json:"proj:shape"`
	Instruments         []string  `json:"instruments"`
	EndDatetime         string    `json:"end_datetime"`
	ModisTileID         string    `json:"modis:tile-id"`
	ProjGeometry        Geometry  `json:"proj:geometry"`
	ProjTransform       []float64 `json:"proj:transform"`
	StartDatetime       string    `json:"start_datetime"`
	ModisVerticalTile   int       `json:"modis:vertical-tile"`
	ModisHorizontalTile int       `json:"modis:horizontal-tile"`
}
