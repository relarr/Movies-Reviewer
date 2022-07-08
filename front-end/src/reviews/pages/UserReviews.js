import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Container from "../../shared/UIcomponents/Container";
import ReviewsList from "../components/ReviewsList";
import LoadingSpinner from '../../shared/UIcomponents/LoadingSpinner';

const UserReviews = () => {
    const [fetchedReviews, setFetchedReviews] = useState();
    const [loading, setLoading] = useState(false);
    const userId = useParams().uid; 

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/reviews/user/${userId}`);
                const resJson = await res.json();

                setLoading(false);
                setFetchedReviews(resJson.userReviews);
            } catch (err){}
        };

        fetchReviews();
    }, [userId]);

    const deleteReviewHandler = reviewId => {
        setFetchedReviews(reviews => reviews.filter(review => review.id !== reviewId));
    };

    return (
        <div>
            {loading && <LoadingSpinner asOverlay />}
            {fetchedReviews && 
                <ReviewsList 
                    reviews={fetchedReviews}
                    onDeleteReview={deleteReviewHandler} />}
            {!fetchedReviews && !loading && 
                <Container topMargin>
                    <h3>User has no reviews</h3>
                </Container>}
        </div>
    );
};

export default UserReviews;