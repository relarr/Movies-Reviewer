import { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import { useNavigate } from 'react-router-dom';
import useInput from "../../shared/hooks/use-input";
import Button from "../../shared/UIcomponents/Button";
import DropOnHover from '../../shared/UIcomponents/DropOnHover';
import Modal from '../../shared/UIcomponents/Modal';
import RatingStars from '../../shared/UIcomponents/RatingStars';
import LoadingSpinner from '../../shared/UIcomponents/LoadingSpinner';
import "./NewReview.css";

const NewReview = () => {
    const auth = useContext(AuthContext);
    const [movieObject, setMovieObject] = useState(null);
    const [showReviewInput, setShowReviewInput] = useState(false);
    const [rate, setRate] =  useState(-1);
    const [loading, setLoading] = useState(false);
    const [movieNotFound, setMovieNotFound] = useState(false);

    const {
        value: title,
        isValid: titleIsValid,
        hasError: titleHasError,
        valueChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler
    } = useInput(val => val.trim() !== '');

    const {
      value: review,
      isValid: reviewIsValid,
      hasError: reviewHasError,
      valueChangeHandler: reviewChangeHandler,
      inputBlurHandler: reviewBlurHandler
    } = useInput(val => val.length > 5);

    const searchMovieHandler = async event => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&t=${title}`);
            const resJson = await res.json();
            
            if (resJson.Response === 'True'){
              setMovieObject(resJson);
              if (movieNotFound) setMovieNotFound(false);
            } else setMovieNotFound(true);

            setLoading(false);
        } catch (err) {}
    }; 

    const navigate = useNavigate();
    const submitReviewHandler = async event => {
      event.preventDefault();

      setLoading(true);
      try {
        await fetch(process.env.REACT_APP_BACKEND_URL + '/reviews',{
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                     'Authorization': 'Bearer ' + auth.token },
          body: JSON.stringify({ 
            title: movieObject.Title, 
            director: movieObject.Director, 
            year: movieObject.Year,
            review,
            poster: movieObject.Poster,
            rate
          })
        });
        setLoading(false);
        navigate('/users');
      } catch (err) {}
    };

    return (
      <div className='new-review'>
        {loading && <LoadingSpinner asOverlay />}
        {showReviewInput && 
          <Modal
            show={showReviewInput}
            onCancel={() => setShowReviewInput(prev => !prev)}
            header={`Enter your review for '${movieObject.Title}'`}
            footer={<div>
                      <RatingStars onInput={ i => setRate(i+1) } />
                      <Button type='button' onClick={() => setShowReviewInput(false)}>CANCEL</Button>
                      <Button 
                        disabled={!reviewIsValid || rate === -1}
                        onClick={submitReviewHandler} >SUBMIT</Button></div>} >
              <div className='movie-review'>
                <textarea
                  className={reviewHasError ? 'input invalid' : 'input'}
                  id='review'
                  type='text'
                  onChange={reviewChangeHandler}
                  onBlur={reviewBlurHandler}
                  placeholder='Enter your review'
                  value={review} />
                {reviewHasError && <p className='error-text'>Enter a valid review</p>}
              </div>
              <div className='movie-review-image'>
                <img src={movieObject.Poster} alt={movieObject.Title} />
              </div>
          </Modal>}
          <div className='auth-container'>
              <div className='form'>
                <form onSubmit={searchMovieHandler}>
                    <input
                        className={titleHasError ? 'input invalid' : 'input'}
                        type='text'
                        id='title'
                        onChange={titleChangeHandler}
                        onBlur={titleBlurHandler}
                        placeholder='Enter the movie title'
                        value={title} />
                        <Button disabled={!titleIsValid}>SEARCH</Button>
                    {titleHasError && <p className='error'>Enter a valid title</p>}
                </form>
              </div>
          </div>
          {movieObject && !movieNotFound && <div className='auth-container'>
              <div className='movie-info'>
                <p>{movieObject.Title}</p>
                <p>{movieObject.Year}</p>
              </div>
              <div className='movie-info'>
                <p>{movieObject.Director}</p>
              </div>
              <div className='movie-info'>
                <p>{movieObject.Genre}</p>
                <DropOnHover content={movieObject.Plot}>Plot</DropOnHover>
              </div>
              <div className='movie-info'>
                <img alt={movieObject.Title} src={movieObject.Poster} />
              </div>
              <div className='confirm-button'>
                  <Button onClick={() => setShowReviewInput(true)}>CONFIRM</Button>
              </div>
          </div>}
          {movieNotFound && <div className='auth-container'><h3>Movie title not found</h3></div>}
      </div>  
    );
};

export default NewReview;