import "@/styles/components/resortCard.css"

function ResortCard(props: {resortName: String; snowfall: String; address: String} ) {
    return <div className="cardContainer">
        <h1 className="resortName">{props.resortName}</h1>
        <div className="resortImg">
            <img src={`src/assets/${props.resortName.replace(' ', '')}.jpg`}></img>
        </div>
        <div className="resortInfo">
            <button className="visitPageButton">Visit Page</button>
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