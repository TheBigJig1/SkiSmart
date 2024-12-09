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
	ID         int
	Name       string
	Address    string
	Zipcode    string
	Lat        float32
	Long       float32
	HomeLink   string
	CameraLink string
	ImageLink  string
}

// SQL command to create Resorts table
var CreateResorts = `CREATE TABLE Resorts (
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
	Zipcode VARCHAR(20) NOT NULL,
    Lat FLOAT(32) NOT NULL,
	Long FLOAT(32) NOT NULL,
	HomeLink VARCHAR(255) NOT NULL,
	CameraLink VARCHAR(255) NOT NULL,
	ImageLink VARCHAR(255) NOT NULL,
	INDEX idx_Name (Name),
	INDEX idx_Zipcode (Zipcode)
);`

// SQL command for insert resort value into table
var InsertResorts = `INSERT INTO Resorts 
VALUES 
    ('The Wisp', '296 Marsh Hill Rd, McHenry, MD', '21541', 39.556649, -79.363863, 'https://www.wispresort.com/', 'https://www.wispresort.com/mountain-report-cams/', 'https://d15zjc2r4e8kr7.cloudfront.net/8517/blog/IMG_2822.jpg'),
    ('Seven Springs', '777 Waterwheel Dr, Champion, PA', '15622', 40.022944, -79.298111, 'https://www.7springs.com/', 'https://www.7springs.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://scene7.vailresorts.com/is/image/vailresorts/20221004_SS_Lewis_1:Featured-Content-AND-Sliding-Cards-AND-Container-Long-Amount?resMode=sharp2&w=855&h=480&wid=392&fit=constrain,1&dpr=on,2.625'),
    ('Timberline', '254 Four Seasons Dr, Davis, WV', '26260', 39.041790, -79.399686, 'https://timberlinemountain.com/', 'https://timberlinemountain.com/snow-cams/', 'https://elkinsrandolphwv.com/wp-content/uploads/2020/10/Timberline-1568x1045.jpg'),
    ('Snowshoe', '10 Snowshoe Dr, Snowshoe, WV', '26209', 38.402509, -79.993196, 'https://www.snowshoemtn.com/', 'https://www.snowshoemtn.com/mountain-info/web-cams', 'https://i0.wp.com/mountaintopcondos.com/wp-content/uploads/2024/09/image-4-scaled-1.jpg?fit=2560%2C1920&ssl=1'),
    ('Vail', '390 Interlocken Cres, Broomfield, CO', '80021', 39.605487, -106.355284, 'https://www.vail.com/', 'https://www.vail.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://www.travelandleisure.com/thmb/YFdvTj2kKw5qIWLMVhSbFhcs6qA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/skiing-vail-mountain-colorado-MMVAIL1221-1543ad9d836f403989991d357e2467de.jpg'),
    ('Breckenridge', '1599 Ski Hill Rd, Breckenridge, CO', '80424', 39.478028, -106.075305, 'https://www.breckenridge.com/', 'https://www.breckenridge.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://scene7.vailresorts.com/is/image/vailresorts/20200609_BR_VailInternal_001:Featured-Stories?resMode=sharp2&w=526&h=350&wid=382&fit=constrain,1&dpr=on,2.625'),
    ('Keystone', '100 Dercum Square, Keystone, CO', '80435', 39.557807, -105.909964, 'https://www.keystoneresort.com/', 'https://www.keystoneresort.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://skibookings.com/wp-content/uploads/RR-Winter-Night.jpg'),
	('Aspen Snowmass', '120 Lower River Rd, Snowmass, CO', '81654', 39.209715, -106.949148, 'https://www.aspensnowmass.com/', 'https://www.aspensnowmass.com/our-mountains/cams', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/57/f0/f2/snowmass-village-at-night.jpg?w=1200&h=-1&s=1'),
    ('Park City', '1345 Lowell Ave, Park City, UT', '84060', 40.651514, -111.507926, 'https://www.parkcitymountain.com/', 'https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://assets.simpleviewinc.com/simpleview/image/upload/crm/saltlake/Screenshot-2023-08-16-153750_02DA0D02-0B88-EB1D-E729CECAF7F96C8F-02da0c34b18f021_02da0f85-0301-6a84-467d751e788cf86e.png'),
    ('Jackson Hole', '3395 Cody Lane, Teton Village, WY', '83025', 43.586985, -110.826246, 'https://www.jacksonhole.com/', 'https://www.jacksonhole.com/mountain-cams', 'https://i0.wp.com/buckrail.com/wp-content/uploads/2022/11/unnamed-10.jpg?fit=1430%2C1071&ssl=1'),
    ('Big Sky', '50 Big Sky Resort Rd, Big Sky, MT', '59716', 45.287761, -111.401394, 'https://bigskyresort.com/', 'https://bigskyresort.com/webcams', 'https://media.cntraveler.com/photos/63c84579dcb5a326dccfa3bd/3:2/w_6438,h_4292,c_limit/Big%20Sky%20Resort_LandscapeWinter2022_39.jpg'),
    ('Steamboat', '2305 Mt Werner Cir, Steamboat Springs, CO', '80487', 40.459341, -106.805243, 'https://www.steamboat.com/', 'https://www.steamboat.com/the-mountain/mountain-cams', 'https://res.cloudinary.com/simpleview/image/upload/v1547486788/clients/steamboat/night_skiing_winter_glow_e3143419-c482-4086-a201-3edd3c42301f.jpg'),
    ('Heavenly', '3860 Saddle Rd, South Lake Tahoe, CA', '96150', 38.935112, -119.940720, 'https://www.skiheavenly.com/', 'https://www.skiheavenly.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://images.squarespace-cdn.com/content/v1/5f379d0d4c13b4408dddc875/1628978484012-YVHNKQE66CIZ7CFQKEPJ/heavenly-ski-resort-lake-tahoe-14.jpg?format=2500w'),
    ('Mammoth Mountain', '10001 Minaret Rd, Mammoth Lakes, CA', '93546', 37.630769, -119.032991, 'https://www.mammothmountain.com/', 'https://www.mammothmountain.com/cams', 'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/crm/mono/Mammoth-Mountain_FE9EEA9F-5056-A36A-080BD66393CE2B66-fe9ee9905056a36_fe9eeb39-5056-a36a-08d1aedff05379a6.jpg'),
    ('Telluride', '565 Mountain Village Blvd, Telluride, CO', '81435', 37.936595, -107.847358, 'https://www.tellurideskiresort.com/', 'https://www.tellurideskiresort.com/webcams', 'https://cdn.shortpixel.ai/spai/q_glossy+ret_img+to_auto/www.slopemagazine.com/wp-content/uploads/Snow/telluride-ski-resort-accommodation.jpg'),
    ('Deer Valley', '2250 Deer Valley Dr S, Park City, UT', '84060', 40.619458, -111.477964, 'https://www.deervalley.com/', 'https://www.deervalley.com/mountain/mountain-cams', 'https://visitutahkenticoprod.blob.core.windows.net/cmsroot/visitutah/media/site-assets/winter-photography/ski-resorts/deer-valley/deer-valley-resort_bald-mountain-2_ski_winter_courtesy-deer-valley.jpg'),
	('Snowbird', '9385 S Snowbird Center Dr, Snowbird, UT', '84092', 40.580111, -111.656271, 'https://www.snowbird.com/', 'https://www.snowbird.com/mountain-report/', 'https://www.bigbearmountainresort.com/-/media/widen/big-bear-mountain-resort/snow-valley/winter/2023-12-1-snow-valley-run.jpeg?w=1024&rev=41d753395f704d1b9b5cd187e893befe&hash=A4662EFD03FB778D9FB27AB75EEC3CF5'),
    ('Alta', '10010 Little Cottonwood Canyon Rd, Alta, UT', '84092', 40.588454, -111.638755, 'https://www.alta.com/', 'https://www.alta.com/weather', 'https://www.altalodge.com/wp-content/uploads/2024/08/altalodge_snow.jpg'),
    ('Sun Valley', '1 Sun Valley Rd, Sun Valley, ID', '83353', 43.677485, -114.342797, 'https://www.sunvalley.com/', 'https://www.sunvalley.com/the-mountain/web-cams/', 'https://wordpress.visitsunvalley.com/wp-content/uploads/2018/12/Family-Vacation_6ee1a1ab42f36f19b83aa67b3b7a39a7.jpg'),
    ('Beaver Creek', '210 Offerson Rd, Beaver Creek, CO', '81620', 39.604202, -106.516584, 'https://www.beavercreek.com/', 'https://www.beavercreek.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://www.powderhounds.com/site/DefaultSite/filesystem/images/USA/BeaverCreek/Overview/03.jpg'),
    ('Stowe Mountain', '5781 Mountain Rd, Stowe, VT', '05672', 44.530538, -72.777033, 'https://www.stowe.com/', 'https://www.stowe.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://shershegoes.com/wp-content/uploads/skiing-stowe-vermont.jpg'),
    ('Sugarbush', '1840 Sugarbush Access Rd, Warren, VT', '05674', 44.136153, -72.881691, 'https://www.sugarbush.com/', 'https://www.sugarbush.com/conditions/webcams', 'https://vermont.com/wp-content/uploads/2022/07/Sugarbush-Resort-Winter-Aerial-Mountain-View.jpg'),
    ('Whiteface Mountain', '5021 NY-86, Wilmington, NY', '12997', 44.365185, -73.902253, 'https://whiteface.com/', 'https://whiteface.com/mountain/webcams/', 'https://whiteface.com/wp-content/uploads/sites/3/2022/02/Landing-Whiteface-View-Jordan-Craig_1920x950.jpg'),
    ('Killington', '4763 Killington Rd, Killington, VT', '05751', 43.621469, -72.796109, 'https://www.killington.com/', 'https://www.killington.com/the-mountain/webcams', 'https://www.killingtongroup.com/wp-content/uploads/2023/01/Killington-Mountains-Shutterstock.jpg'),
    ('Jay Peak', '830 Jay Peak Rd, Jay, VT', '05859', 44.936111, -72.534638, 'https://jaypeakresort.com/', 'https://jaypeakresort.com/mountain/webcams', 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/157000/157170-Jay-Peak-Ski-Resort.jpg'),
    ('Taos Ski Valley', '116 Sutton Pl, Taos Ski Valley, NM', '87525', 36.596151, -105.454515, 'https://www.skitaos.com/', 'https://www.skitaos.com/mountain/webcams', 'https://images.discerningassets.com/image/upload/c_fit,h_1000,w_1000/c_fit,fl_relative,h_1.0,o_100,w_1.0/v1661625657/Taos_Ski_Valley_Sunset_mbqfje.jpg'),
    ('Snowbasin', '3925 Snowbasin Rd, Huntsville, UT', '84317', 41.216841, -111.856946, 'https://www.snowbasin.com/', 'https://www.snowbasin.com/the-mountain/webcams', 'https://cdn.kslnewsradio.com/kslnewsradio/wp-content/uploads/2022/02/5445278-scaled-e1644963494214.jpg'),
    ('Copper Mountain', '209 Ten Mile Cir, Frisco, CO', '80443', 39.502852, -106.149569, 'https://www.coppercolorado.com/', 'https://www.coppercolorado.com/the-mountain/webcams', 'https://images.squarespace-cdn.com/content/v1/6255e8aebe87e470fdd12049/f6ce3cab-d11c-4807-8d17-e33028394609/Copper-Mountain.jpeg'),
    ('Palisades Tahoe', '1960 Squaw Valley Rd, Olympic Valley, CA', '96146', 39.197518, -120.235384, 'https://www.palisadestahoe.com/', 'https://www.palisadestahoe.com/mountain/webcams', 'https://travelnevada.com/wp-content/uploads/2021/11/Squaw5_BenBirk-1024x576-1.jpg'),
    ('Northstar California', '5001 Northstar Dr, Truckee, CA', '96161', 39.273676, -120.121144, 'https://www.northstarcalifornia.com/', 'https://www.northstarcalifornia.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://travelnevada.com/wp-content/uploads/2014/04/Northstar1-1024x576.jpg'),
    ('Mt. Bachelor', '13000 SW Century Dr, Bend, OR', '97702', 43.979591, -121.688923, 'https://www.mtbachelor.com/', 'https://www.mtbachelor.com/conditions/webcams', 'https://lift.opensnow.com/summary/20240117-2c0d6576ba.jpg'),
    ('Whitefish Mountain', '1015 Glades Dr, Whitefish, MT', '59937', 48.482574, -114.355624, 'https://skiwhitefish.com/', 'https://skiwhitefish.com/webcams/', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/02/71/3d/a2/whitefish-mountain-resort.jpg?w=1200&h=1200&s=1'),
    ('Arapahoe Basin', '28194 US-6, Dillon, CO', '80435', 39.642912, -105.871750, 'https://www.arapahoebasin.com/', 'https://www.arapahoebasin.com/webcams/', 'https://static.evo.com/content/travel-guides/colorado/abasin/2023-update/abasin-2023-4.jpg'),
    ('Loon Mountain', '60 Loon Mountain Rd, Lincoln, NH', '03251', 44.045711, -71.621174, 'https://www.loonmtn.com/', 'https://www.loonmtn.com/webcams', 'https://cdn.sanity.io/images/k8yfdmw9/loon/38ac4948a836d312d7269f5897d2640650f2520b-1200x630.jpg?w=1200&auto=format'),
    ('Bretton Woods', '99 Ski Area Rd, Bretton Woods, NH', '03575', 44.258256, -71.437818, 'https://www.brettonwoods.com/', 'https://www.brettonwoods.com/conditions/webcams', 'https://www.omnihotels.com/-/media/images/hotels/mtwash/activities/mtwash-omni-mount-washington-resort-alpine03.jpg?h=660&iar=0&w=1170'),
    ('Okemo', '77 Okemo Ridge Rd, Ludlow, VT', '05149', 43.403197, -72.717569, 'https://www.okemo.com/', 'https://www.okemo.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://i.redd.it/b6fr4xlvr9fa1.jpg'),
    ('Sugarloaf', '5092 Access Rd, Carrabassett Valley, ME', '04947', 45.031186, -70.313312, 'https://www.sugarloaf.com/', 'https://www.sugarloaf.com/webcams', 'https://skinorthamerica100.com/wp-content/uploads/2023/05/IMG_2781-scaled.jpg'),
    ('Sunday River', '15 S Ridge Rd, Newry, ME', '04261', 44.470657, -70.856742, 'https://www.sundayriver.com/', 'https://www.sundayriver.com/webcams', 'https://cdn.sanity.io/images/k8yfdmw9/sunday-river/ff6e66a420ba3cdaada5d67e46d6e1dcda1275ce-2048x1365.jpg?w=1920&auto=format'),
    ('Cannon Mountain', '260 Tramway Dr, Franconia, NH', '03580', 44.172086, -71.686144, 'https://www.cannonmt.com/', 'https://www.cannonmt.com/webcams', 'https://admin.cannonmt.com/publicFiles/images/Cannon1-12-19_072-CROP.jpeg'),
    ('Mad River Glen', '57 Schuss Pass Rd, Waitsfield, VT', '05673', 44.201119, -72.916694, 'https://www.madriverglen.com/', 'https://www.madriverglen.com/webcams/', 'https://vermont.com/wp-content/uploads/2022/07/Mad-River-Glen-Single-Chair.jpeg'),
    ('Mount Snow', '39 Mount Snow Rd, West Dover, VT', '05356', 42.964943, -72.896586, 'https://www.mountsnow.com/', 'https://www.mountsnow.com/the-mountain/mountain-conditions/mountain-cams.aspx', 'https://scene7.vailresorts.com/is/image/vailresorts/20220211_SO_FisherCreative_809:Featured-Content-AND-Sliding-Cards-AND-Container-Long-Amount?resMode=sharp2&w=855&h=480&wid=412&fit=constrain,1&dpr=on,2.625'),
	('Stratton Mountain', '5 Village Lodge Rd, Stratton, VT', '05360', 43.113144, -72.903057, 'https://www.stratton.com/', 'https://www.stratton.com/the-mountain/mountain-report', 'https://vermont.com/wp-content/uploads/2022/06/Stratton-Mountain-Resort-Winter-Aerial-Mountain-and-Village.jpg'),
    ('Schweitzer Mountain', '10000 Schweitzer Mountain Rd, Sandpoint, ID', '83864', 48.373089, -116.622317, 'https://www.schweitzer.com/', 'https://www.schweitzer.com/mountain-info/webcam', 'https://www.schweitzer.com/-/media/schweitzer/drone/schweitzer-1920x1080-drone-mountainview.jpg?w=1024&rev=524eba117eb944e59c245a6a26e4b4c8&hash=92E9134293C776408FF083024EC3B761'),
    ('Crystal Mountain', '33914 Crystal Mountain Blvd, Enumclaw, WA', '98022', 46.928512, -121.475944, 'https://www.crystalmountainresort.com/', 'https://www.crystalmountainresort.com/the-mountain/webcams', 'https://www.powder.com/.image/t_share/MjA0NjAzNjE1NTM5NjM2MTUz/crystal-mountain-resort-pc-jason-hummel.jpg')
	;`

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

	// Get user Zip code
	userZip := values.Get("zip")
	userZipInt := 0

	fmt.Print("User Zip: ", userZip, "\n")

	userZipInt, err = strconv.Atoi(userZip)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Error converting zip code to int: ", err)
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
		if err = rows.Scan(&rl.ID, &rl.Name, &rl.Address, &rl.Zipcode, &rl.Lat, &rl.Long, &rl.HomeLink, &rl.CameraLink, &rl.ImageLink); err != nil {
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
	if name == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintln(w, "Name parameter is required")
		return
	}

	searchName := "%" + name + "%" // SQL wildcard search

	// Create prepared statement stmt for query parameters
	stmt, err := db.Prepare("SELECT * FROM [dbo].[Resorts] WHERE Name LIKE @Name")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error preparing statement: ", err)
		return
	}
	defer stmt.Close()

	// Execute prepared statement
	rows, err := stmt.Query(sql.Named("Name", searchName))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error executing query: ", err)
		return
	}
	defer rows.Close()

	var resorts []Resort

	// Iterate over result set
	for rows.Next() {
		var tr Resort
		err = rows.Scan(&tr.ID, &tr.Name, &tr.Address, &tr.Zipcode, &tr.Lat, &tr.Long, &tr.HomeLink, &tr.CameraLink, &tr.ImageLink)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error scanning row: ", err)
			return
		}
		resorts = append(resorts, tr)
	}

	// Check if no resorts were found
	if len(resorts) == 0 {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintln(w, "No resorts found")
		return
	}

	// Server acknowledges success
	log.Println("Resorts returned successfully")
	w.WriteHeader(http.StatusOK) // 200 OK
	_ = json.NewEncoder(w).Encode(resorts)
}
