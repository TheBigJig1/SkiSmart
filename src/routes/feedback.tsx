import {useState} from 'react';
import '@/styles/routes/feedback.css';

function Feedback() {
    const [selectRate, setSelectRate]=useState(0);
    const [feedback,setFeedback]=useState('');

    const hanStarCl= (index: number) =>
    {
        setSelectRate(index+1);
        console.log('Star clicked');
    };
    const handleSub= () =>
    {
        //We'll just need to add a submit part that actually submits the feedback and ratings before reseting
        console.log('Feedback submitted', feedback,selectRate);
        setFeedback(''); //resets feedback
        setSelectRate(0); //resets star rating

    };
    return (
        <div className="fcontainer">
            <div className="fbackground">
                <img src='src/assets/logoCircle.png' className="flogo"></img>
                <div className="ftitle">SkiSmart</div>
                    <form className="feedback-box" onSubmit={handleSub}>
                        <label htmlFor="feedback">Feedback: </label>
                        <textarea className="thisfeedback" rows={3} placeholder="Type feedback here" style={{ width: '100%' }} value={feedback} onChange={(e)=>setFeedback(e.target.value)}></textarea>
                        <h3> Leave Us A Review:</h3>
                        <div className="starRating">
                            {[...Array(5)].map((_,index)=> (
                                <span 
                                    key= {index} 
                                    className={`star ${selectRate > index ? 'selected' : ''}`}
                                    onClick={()=> hanStarCl(index)}
                                    >
                                        ★
                                    </span>
                            ))}
                        </div>
                        <button className="submitButton" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: 'black', color: 'white'}} type= "submit" > Submit </button>
                    </form>
            </div>
            
            
            <div className="feedbackDisplay">
                <h3>User Reviews</h3>
                <div className="feedbackItem"><h2>Feedback: FEEEEEEEEEE</h2></div>
                <div className="feedbackItem"><h2>Feedback: FEEEEEEEEEE</h2></div>
                <div className="feedbackItem"><h2>Feedback: FEEEEEEEEEE</h2></div>
            </div>
        </div>

    );
 }

 export default Feedback