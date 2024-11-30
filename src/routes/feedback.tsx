import {useEffect, useState} from 'react';
import '@/styles/routes/feedback.css';
import { jwtDecode }  from 'jwt-decode';

// Define interface for response data
interface FeedbackReview {
    id:         number;
    first:      string;
    rating:     number;
    feedback:   string;
}

function Feedback() {
    // State variables
    const [selectRate, setSelectRate]=useState(0);
    const [feedback,setFeedback]=useState('');
    const [first, setFirst] = useState('');
    const [limit, setLimit] = useState(3);
    const [reviews, setReviews] = useState<FeedbackReview[]>([]);
    
    useEffect(() => {
        // List reviews
        listReviews(limit);

        // TODO instead of loading a larger feedback array each time limit is changed, append the offset + the next x feedbacks to the existing array

        // Retrieve user data from localStorage
        const token = localStorage.getItem('token') || ''
        if (!token) {
            setFirst('AnonymousCoward');
            return;
        }
        const decoded = jwtDecode(token) as { user: { email: string; first: string; last: string; zipcode: string } };
        const user = decoded.user;
        if (user && user.first) {
            setFirst(user.first);
        }

    }, [limit]); // Add limit as a dependency to re-fetch reviews when limit changes

    const hanStarCl= (index: number) =>
    {
        setSelectRate(index+1);
        console.log('Star clicked');
    };

    // Submit feedback
    const handleSub = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Create form data
        const formData = new URLSearchParams();
        formData.append('first', first);
        formData.append('feedback', feedback);
        formData.append('rating', selectRate.toString());

        // Send feedback to server
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

                // Reload page
                window.location.reload();
        
              } else {
                // Handle error response
                console.error('Error submitting feedback');
              }

        } catch (error) {
            console.error('Error:', error);
        }

        console.log('Feedback submitted', feedback,selectRate);
        
        setFeedback(''); //resets feedback
        setSelectRate(0); //resets star rating
    };

    // List reviews from the server
    const listReviews = async (limit: number) => {
        try {
            // Fetch reviews from server

            // Endpoint is parameterized
            const response = await fetch(`http://localhost:8080/feedback/list?limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok) {
                // Handle successful response
                const feedbacks = await response.json();

                // Update reviews state variable
                setReviews(feedbacks);

                // Log reviews
                console.log('Reviews fetched successfully');
                console.log(feedbacks);
                return;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
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
                <h1>Our Reviews!</h1>
                {reviews && reviews.map((review, reviewIndex) => (
                    <div key={reviewIndex} className="feedbackItem">
                        <h2>{review.first}</h2>
                        <div className="starsGiven">
                            {[...Array(5)].map((_, starIndex) => (
                                <span
                                    key={starIndex}
                                    className={`staticReviewstar ${review.rating > starIndex ? 'selected' : ''}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <h3>{review.feedback}</h3>
                    </div>
                ))}
                <div>
                    <button className="moreReviews" 
                    onClick={() => {setLimit(limit + 3) }}>More Reviews</button>
                </div>
            </div>
        </div>

    );
}

export default Feedback