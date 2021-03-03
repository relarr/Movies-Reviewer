import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Container from '../../shared/UIcomponents/Container';
import Cinput from '../../shared/UIcomponents/Cinput';
import Cbutton from '../../shared/UIcomponents/Cbutton';
import Stars from '../../shared/UIcomponents/Stars';
import { VALIDATE_MINLENGTH } from '../../util/formValidator';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './UpdateMovie.css';
import ErrorModal from '../../shared/UIcomponents/ErrorModal';
import Spinner from '../../shared/UIcomponents/Spinner';

const UpdateMovie = props => {
    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedMovie, setLoadedMovie] = useState();
    const mid = useParams().mid;
    const [review, setReview] = useState({ val: '', reviewValidity: false });
    const [rate, setRate] = useState();
    const [oldRate, setOldRate] = useState();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/api/movies/${mid}`);
                
                setLoadedMovie(responseData.movie);
                setOldRate(responseData.movie.rate)
                setRate(responseData.movie.rate)
            } catch (err){}
        };
        fetchMovie();
    }, [sendRequest, mid]);

    const setReviewHandler = useCallback((value, validity) => {
        setReview({ val: value, reviewValidity: validity });
    }, []);

    const setRateHandler = useCallback((newRate) => {
        setRate(newRate);
    }, []);

    const history = useHistory();

    const submitEditedReviewHandler = async e => {
        e.preventDefault();
        try {
            await sendRequest(process.env.REACT_APP_BACKEND_URL + `/api/movies/${mid}`,
                'PATCH',
                JSON.stringify({
                    review: review.val,
                    rate: rate
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }    
            );
            history.push(`/${auth.userId}/movies`);
        } catch (err){}
    };

    return (
        <React.Fragment>
            <div className='update-movie'>
                <ErrorModal error={error} onClear={clearError} />
                <Container >
                    {isLoading && <Spinner asOverlay/>}
                    {!isLoading && loadedMovie && <form onSubmit={submitEditedReviewHandler}>
                        <p>{loadedMovie.title}</p>
                        <Cinput 
                                id='review'
                                type='text'
                                label='Edit your Review'
                                validators={[VALIDATE_MINLENGTH(5)]}
                                onInput={setReviewHandler}
                                initialValue={loadedMovie.review}
                                />
                            <div className='update-movie--rate'>
                                <Stars onInput={setRateHandler} rate={loadedMovie.rate} />
                            </div>
                        <div className='update-movie--buttons'>
                            <Cbutton reversed type='submit' disabled={rate === oldRate && !review.reviewValidity} >SUBMIT</Cbutton>
                            <Cbutton danger to={`/${auth.userId}/movies`}>CANCEL</Cbutton>
                        </div>
                    </form>}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default UpdateMovie;