import leafmap
import os
from datetime import date
date = date.today()
os.environ["TITILER_ENDPOINT"] = "planetary-computer"

url = "https://planetarycomputer.microsoft.com/api/stac/v1"
collection = "noaa-mrms-qpe-24h-pass2"
time_range = f"{date}T01:00:00Z"
bbox = [-85.0, 35.0, -75.0, 42.0]

search = leafmap.stac_search(
    url=url,
    max_items=10,
    collections=[collection],
    bbox=bbox,
    datetime=time_range,
    get_info=True,
)

item = list(search.keys())[0]

assets = list(leafmap.stac_assets(collection=collection, item=item, titiler_endpoint="pc"))

m = leafmap.Map()

for asset in assets:
    m.add_stac_layer(
        collection=collection,
        item=item,
        assets=[asset], 
        name=asset + " Color infrared",
    )

m.to_html("planetary_computer_NClimGrid.html", title="Awesome 3D Map", width="100%", height="500px")