import { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../shared/context/auth-context';
import Modal from '../../shared/UIcomponents/Modal';
import Button from '../../shared/UIcomponents/Button';
import RatingStars from '../../shared/UIcomponents/RatingStars';
import LoadingSpinner from '../../shared/UIcomponents/LoadingSpinner';
import './Review.css';

const Review = (props) => {
  const auth = useContext(AuthContext);
  const [showReview, setShowReview] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [currentReview, setCurrentReview] = useState(props.review);
  const [showDelete, setShowDelete] = useState(false);
  const [invalidInput, setInvalidInput] = useState({
    invalid: false,
    message: '',
  });
  const [rate, setRate] = useState(props.rate);
  const [loading, setLoading] = useState(false);

  const modalCancelHandler = () => {
    setShowReview((prev) => !prev);
    setShowEditView(false);
  };

  const reviewChangeHandler = (event) => {
    event.preventDefault();
    setCurrentReview(event.target.value);
    if (invalidInput.invalid) setInvalidInput({ invalid: false, message: '' });
  };

  const setRateHandler = useCallback((newRate) => {
    setRate(newRate + 1);
  }, []);

  const navigate = useNavigate();
  const submitUpdatedReviewHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/reviews/${props.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          },
          body: JSON.stringify({
            updatedReview: currentReview,
            updatedRate: rate,
          }),
        }
      );
      if (res.status === 422) {
        setInvalidInput({
          invalid: true,
          message: 'Enter at least 5 characters',
        });
        return;
      }
      setLoading(false);
      setShowEditView(false);
      navigate('/users');
    } catch (err) {}
  };

  const deleteReviewHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch(process.env.REACT_APP_BACKEND_URL + `/reviews/${props.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        },
      });
      setLoading(false);
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <div className='review-container'>
      {loading && <LoadingSpinner asOverlay />}
      {showReview && (
        <Modal
          show={showReview}
          onCancel={modalCancelHandler}
          header={`${
            props.creatorId === auth.userId ? 'Your review' : 'Review'
          } for '${props.title}'`}
          footer={
            <div>
              <RatingStars rate={props.rate} disabled />
              <Button type='button' onClick={() => setShowReview(false)}>
                CLOSE
              </Button>
            </div>
          }
        >
          <p>{props.review}</p>
        </Modal>
      )}
      {showDelete && (
        <Modal
          show={showDelete}
          onCancel={() => setShowDelete(false)}
          header={`Are you sure you want to delete your review for '${props.title}'?`}
          footer={
            <div>
              <Button
                type='button'
                alternate
                onClick={() => setShowDelete(false)}
              >
                CANCEL
              </Button>
              <Button onClick={deleteReviewHandler}>CONFIRM</Button>
            </div>
          }
        ></Modal>
      )}
      {showEditView && (
        <Modal
          show={showEditView}
          onCancel={() => setShowEditView(false)}
          header={`Edit your review for '${props.title}'`}
          footer={
            <div>
              <RatingStars onInput={setRateHandler} rate={props.rate} />
              <Button
                type='button'
                alternate
                onClick={() => setShowEditView(false)}
              >
                CANCEL
              </Button>
              <Button onClick={submitUpdatedReviewHandler}>SUBMIT</Button>
            </div>
          }
        >
          <textarea value={currentReview} onChange={reviewChangeHandler} />
        </Modal>
      )}

      <div className='review-poster'>
        <img src={props.poster} alt={props.title} />
      </div>
      <div className='review-movie-info'>
        <p>{props.title}</p>
        <p>{props.director}</p>
        <p>{props.year}</p>
      </div>
      <div className='review-buttons'>
        <Button onClick={() => setShowReview(true)} fullWidth>
          READ
        </Button>
        {props.creatorId === auth.userId && (
          <Button onClick={() => setShowEditView(true)} fullWidth>
            EDIT
          </Button>
        )}
        {props.creatorId === auth.userId && (
          <Button onClick={() => setShowDelete(true)} fullWidth alternate>
            DELETE
          </Button>
        )}
      </div>
    </div>
  );
};

export default Review;
