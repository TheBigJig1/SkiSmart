import '@/styles/routes/feedback.css';
import mountain from '../assets/review-background.jpg';


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
            <div className="fbackground" style={{ backgroundImage: `url(${mountain})` }}>
                <img src='src/assets/logoCircle.png' className="flogo"></img>
                <div className="ftitle">SkiSmart</div>
                <div className="feedback-container">
                <form className="feedback-box" onSubmit={handleSub}>
                    <label htmlFor="feedback">Feedback: </label>
                    <textarea id="feedback" rows={4} placeholder= "Type feedback here"> </textarea>
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
                    <button type= "submit"> Submit </button>
                </form>
            </div>
            </div>
            
            <div className="feedbackDisplay">
                <h1>Feeback</h1>
                <h1>Feeback</h1>
                <h1>Feeback</h1>
            </div>
        </div>

    );
 }

 export default Feedback