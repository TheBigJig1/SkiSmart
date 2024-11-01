import '@/styles/routes/feedback.css';


function Feedback() {
    const hanStarCl= () =>
    {
        console.log('Star clicked');
    };
    const handleSub= () =>
    {
        console.log('Feedback submitted');

    }
    return (
        <div className="fcontainer">
            <div className="fbackground">
                <img src='src/assets/logoCircle.png' className="flogo"></img>
                <div className="ftitle">SkiSmart</div>
                    <form className="feedback-box" onSubmit={handleSub}>
                        <label htmlFor="feedback">Feedback: </label>
                        <textarea className="thisfeedback" rows={3} placeholder="Type feedback here" style={{ width: '100%' }}></textarea>
                        <h3> Leave Us A Review:</h3>
                        <div className="starRating">
                            {[...Array(5)].map((_,index)=> (
                                <span 
                                    key= {index} 
                                    className="star" 
                                    onClick={()=> hanStarCl()}
                                    >
                                        ★
                                    </span>
                            ))}
                        </div>
                        <button className="submitButton" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: 'black', color: 'white'}} type= "submit" > Submit </button>
                    </form>
            </div>
            
            <div className="feedbackDisplay">
                <div className="feedbackItem"><h2>Feedback: FEEEEEEEEEE</h2></div>
                <div className="feedbackItem"><h2>Feedback: FEEEEEEEEEE</h2></div>
                <div className="feedbackItem"><h2>Feedback: FEEEEEEEEEE</h2></div>
            </div>
        </div>

    );
 }

 export default Feedback