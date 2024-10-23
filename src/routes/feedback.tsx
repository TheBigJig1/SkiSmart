import '@/styles/routes/feedback.css';
import mountain from '../assets/skiMountains.jpg';


function Feedback() {
    return (

        <div className="backImg" style={{ backgroundImage: `url(${mountain})` }}>
            <div className= "feedback-container">
                <div className="feedback-box">
                    <label htmlFor="feedback">Feedback: </label>
                    <textarea id="feedback" rows={4} placeholder= "Type feedback here"> </textarea>
                </div>
            </div>
        </div>

    )
 }

 export default Feedback