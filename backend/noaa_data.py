from pystac_client import Client
import json
from datetime import date

# Connect to the Planetary Computer STAC API
catalog_url = "https://planetarycomputer.microsoft.com/api/stac/v1"
catalog = Client.open(catalog_url)

date = date.today()

# Search for MRMS QPE data
search = catalog.search(
    collections="noaa-mrms-qpe-24h-pass2",  # NOAA MRMS QPE collection
    datetime=f"{date}T01:00:00Z",  # Date range
    query={"noaa_mrms_qpe:region": {"eq": "CONUS"}},
)

# Fetch items
items = list(search.items())

if not items:
    print("No MRMS QPE data found for the given query.")
    exit()

# Prepare data for saving
data = {
    "type": "FeatureCollection",
    "features": [item.to_dict() for item in items]
}

# Save data to a JSON file
output_file = "mrms_qpe_data.json"
with open(output_file, "w") as f:
    json.dump(data, f, indent=4)

print(f"MRMS QPE data saved to '{output_file}'.")