import '@/styles/routes/feedback.css';


function Feedback() {
    return (
    <div className= "feedback-container">
        <div className="feedback-box">
            <label htmlFor="feedback">Feedback: </label>
            <textarea id="feedback" rows={4} placeholder= "Type feedback here"> </textarea>

        </div>

    </div>
    )
 }

 export default Feedback