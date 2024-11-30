import "@/styles/components/resortCard.css"
import { useEffect, useState } from "react";

interface ResortPreview {
    name: string;
    address: string;
    imageLink: string;
}

function ResortCard(props: {key: number; resortName: string; imageLink: string; address: string; zipcode: string; snowfall: string;} ) {

    function setStorage() {
        localStorage.setItem("curResort", props.resortName);
    }

    return <div className="cardContainer">
        <h1 className="resortName">{props.resortName}</h1>
        <div className="resortImg">
            <img src={props.imageLink}></img>
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