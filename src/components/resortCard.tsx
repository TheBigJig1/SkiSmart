import "@/styles/components/resortCard.css"
import { useEffect, useState } from "react";

interface ResortPreview {
    name: string;
    address: string;
    imageLink: string;
}

function ResortCard(props: {key: number; resortName: string; imageLink: string; address: string; snowfall: string;} ) {

    // const [thisResort, setThisResort] = useState<ResortPreview>();

    // useEffect(() => {

    //     getResort();
    //     console.log("ResortCard component mounted");

    // }, []);

    // const getResort = async () => {
    //     try {
    //         // Fetch reviews from server
    //         // Endpoint is parameterized
    //         const response = await fetch(`http://localhost:8080/resorts/get?name=${props.resortName}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if(response.ok) {
    //             // Handle successful response
    //             const tr = await response.json();
    //             setThisResort(tr);

    //             // Log reviews
    //             console.log('Resort fetched successfully');
    //             console.log(thisResort);
    //             return;
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    function setStorage() {
        localStorage.setItem("resortName", props.resortName);
        localStorage.setItem("snowfall", "two");
        localStorage.setItem("address", "three");
        localStorage.setItem("image", "four");
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