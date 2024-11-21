import {useEffect, useState} from 'react';
import '@/styles/routes/feedback.css';
import { jwtDecode }  from 'jwt-decode';


function Feedback() {
    const [selectRate, setSelectRate]=useState(0);
    const [feedback,setFeedback]=useState('');
    const [email, setEmail] = useState('');
    
    useEffect(() => {
        // Retrieve user data from localStorage
        const token = localStorage.getItem('token') || ''
        if (!token) {
            setEmail('AnonymousCoward');
            return;
        }
        const decoded = jwtDecode(token) as { user: { email: string; first: string; last: string; zipcode: string } };
        const user = decoded.user;
        if (user && user.email) {
            setEmail(user.email);
        }
    }, []);

    const hanStarCl= (index: number) =>
    {
        setSelectRate(index+1);
        console.log('Star clicked');
    };

    const handleSub = async (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('feedback', feedback);
        formData.append('rating', selectRate.toString());

        try {
            const response = await fetch('http://localhost:8080/feedback/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString(),
                // credentials: 'include',
              });

              if (response.ok) {
                // Handle successful response
                console.log('Feedback submitted successfully');
                alert('Feedback submitted successfully!');
        
              } else {
                // Handle error response
                console.error('Error submitting feedback');
              }

        } catch (error) {
            console.error('Error:', error);
        }

        // We'll just need to add a submit part that actually submits the feedback and ratings before reseting
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