import "@/styles/components/resortCard.css"
import { ResortObj } from "../routes/resort"
// import { useEffect, useState } from "react";


function ResortCard(resort: ResortObj) {

    function setStorage() {
        localStorage.setItem("curResort", "timberline");
    }

    return <div className="cardContainer">
        <h1 className="resortName">{resort.Name}</h1>
        <div className="resortImg">
            <img src={resort.ImageLink}></img>
        </div>
        <div className="resortInfo">
            <a href="/resortInfo">
                <button className="visitPageButton" onClick={setStorage}>Visit Page</button>
            </a>
            <div className="snowfall">
                <h2>{"props.snowfall"}</h2>
            </div>
            <div className="address">
                <h2>{resort.Address}</h2>
            </div>
        </div>
    </div>
}

export default ResortCard