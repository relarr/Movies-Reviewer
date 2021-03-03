import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Cinput from '../../shared/UIcomponents/Cinput';
import Cbutton from '../../shared/UIcomponents/Cbutton';
import Stars from '../../shared/UIcomponents/Stars';
import Container from '../../shared/UIcomponents/Container';
import Spinner from '../../shared/UIcomponents/Spinner';
import ErrorModal from '../../shared/UIcomponents/ErrorModal';
import { AuthContext} from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { VALIDATE_MINLENGTH } from '../../util/formValidator';

import './NewMovie.css';
import Modal from '../../shared/UIcomponents/Modal';

const NewMovie = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [movieObject, setMovieObject] =  useState();
    const [confirmedMovie, setConfirmedMovie] = useState(false);
    const [confirmButton, setConfirmButton] = useState(false);

    const [title, setTitle] = useState({ val: '', titleValidity: false });

    const [director, setDirector] = useState();
    const [year, setYear] = useState();
    const [poster, setPoster] = useState();
    const [rate, setRate] = useState(-1);
    
    const [review, setReview] = useState({ val: '', reviewValidity: false });

    const setTitleHandler = useCallback((value, validity) => {
        setTitle({ val: value, titleValidity: validity });
    }, []);

    const history = useHistory();

    const submitReviewHandler = async e => {
        e.preventDefault();
        
        try {
            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/api/movies',
                    'POST',
                    JSON.stringify({
                        title: movieObject.Title,
                        director: director,
                        year: year,
                        review: review.val,
                        image: poster,
                        rate: rate
                    }),
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    },
            );
            history.push('/');
        } catch (err){}
    };

    const confirmedMovieHandler = () => {
        setConfirmedMovie(prev => !prev);
        setRate(-1);
    };

    const setMovieAttributesHandler = movieAttributes => {
        setDirector(movieAttributes.Director);
        setYear(movieAttributes.Year);
        setPoster(movieAttributes.Poster);
    };

    const searchMovieHandler = async e => {
        e.preventDefault();
        const response = await fetch(process.env.REACT_APP_MOVIES_API_KEY + `&t=${title.val}`);
        const responseData = await response.json();
        setMovieObject(responseData);
        setMovieAttributesHandler(responseData);
        setConfirmButton(true);
    };

    const setReviewHandler = useCallback((value, validity) => {
        setReview({ val: value, reviewValidity: validity });
    }, []);

    const rateHandler = (i) => {
        setRate(i);
    };

    return (
        <div className='new-movie'>
            <ErrorModal error={error} onClear={clearError}/>
            {confirmedMovie && 
                <Modal
                    show={confirmedMovie}
                    onCancel={confirmedMovieHandler}
                    header={`Enter your review for ${movieObject.Title}`}
                    footer={<React.Fragment>
                                <Cbutton
                                    reversed
                                    disabled={!title.titleValidity || !review.reviewValidity || rate === -1}
                                    onClick={submitReviewHandler} >SUBMIT REVIEW</Cbutton>
                                <Cbutton danger onClick={confirmedMovieHandler}>CANCEL</Cbutton>
                            </React.Fragment>}>

                    <Cinput 
                        id='review'
                        label='Enter your review'
                        placeholder='Your Review'
                        validators={[VALIDATE_MINLENGTH(5)]}
                        onInput={setReviewHandler} />                    
                    
                    <div className='new-movie--content'>
                        <Stars onInput={rateHandler} />
                    </div>
                    <img className='new-movie--review-img' src={movieObject.Poster} alt={movieObject.Title} />
                </Modal>}

            <div className='new-movie--container'>  
                <Container avatar>
                    <form onSubmit={searchMovieHandler}>
                        <Cinput 
                            id='title'
                            type='text'
                            option='input'
                            label='Enter the movie title'
                            placeholder='Movie Title'
                            validators={[VALIDATE_MINLENGTH(4)]}
                            onInput={setTitleHandler} />
                        <Cbutton type='submit' reversed onClick={() => {}}>SEARCH</Cbutton>
                        
                    </form>
                    <div>
                        {isLoading && <Spinner asOverlay/>}
                        {movieObject &&
                            <div className='new-movie--attributes'>
                                <p>Director</p>
                                <h4>{movieObject.Director}</h4>
                                <p>Year</p>
                                <h4>{movieObject.Year}</h4>
                            </div>}
                        {confirmButton && <Cbutton
                                             
                                            onClick={confirmedMovieHandler}
                                            disabled={!title.titleValidity} >
                                                CONFIRM MOVIE
                                        </Cbutton>}
                    </div>
                </Container>
                <div className='new-movie--poster-preview'>
                    {movieObject && <img src={movieObject.Poster} alt={movieObject.Title} />}
                </div>
            </div> 
            
        </div>
    );
};

export default NewMovie;