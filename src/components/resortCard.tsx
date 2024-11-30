import "@/styles/components/resortCard.css"

function ResortCard(props: {resortName: string; image: string; snowfall: string; address: string; lat: string; long: string;} ) {

    function setStorage() {
        localStorage.setItem("resortName", props.resortName);
        localStorage.setItem("snowfall", props.snowfall);
        localStorage.setItem("address", props.address);
        localStorage.setItem("lat", props.lat);
        localStorage.setItem("long", props.long);
        localStorage.setItem("image", props.image);
    }

    return <div className="cardContainer">
        <h1 className="resortName">{props.resortName}</h1>
        <div className="resortImg">
            <img src={props.image}></img>
        </div>
        <div className="resortInfo">
            <a href="/resortInfo">
                <button className="visitPageButton" onClick={setStorage}>Visit Page</button>
            </a>
            <div className="snowfall">
                <h2>{props.snowfall}</h2>
            </div>
            <div className="address">
                <h2>{props.address}</h2>
            </div>
        </div>
    </div>
}

export default ResortCard