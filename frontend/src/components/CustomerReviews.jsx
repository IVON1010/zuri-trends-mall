import { useState, useEffect } from 'react';
import './CustomerReviews.css';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/reviews');
        const data = await response.json();
        const selectedReviews = data.splice(0, 4);
        setReviews(selectedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="customer-reviews">
      <h2>Customer Reviews</h2>
      <div className="reviews">
        {reviews.map((review, index) => (
          <div className="review" key={index}>
            <p>&quot;{review.comment}&quot;</p>
            <h3>- {review.user_id}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
