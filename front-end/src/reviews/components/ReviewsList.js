import Review from "./Review";
import './ReviewList.css';

const ReviewsList = props => {
    return (
        <div className='review-list'>
            {props.reviews.map(review => <Review 
                                            key={review.id}
                                            id={review.id}
                                            title={review.title}
                                            director={review.director}
                                            year={review.year}
                                            poster={review.poster}
                                            review={review.review}
                                            rate={review.rate-1}
                                            creatorId={review.creator} 
                                            onDelete={props.onDeleteReview} />)}
        </div>
    );
};

export default ReviewsList;