import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MoviesList from '../components/MoviesList';
import Spinner from '../../shared/UIcomponents/Spinner';
import ErrorModal from '../../shared/UIcomponents/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserMovies = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedMovies, setLoadedMovies] = useState();
    const uid = useParams().uid;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/api/movies/user/${uid}`);
                setLoadedMovies(responseData.userMovies);
            } catch (err){}            
        };
        fetchMovies();
    }, [sendRequest, uid]);

    const movieDeletedHandler = deletedMovieId => {
        setLoadedMovies(movies => movies.filter(movie => movie.id !== deletedMovieId));
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <Spinner asOverlay/>}
            {!isLoading && loadedMovies && <MoviesList userMovies={loadedMovies} onDeleteMovie={movieDeletedHandler}/>}
        </React.Fragment>
    );
};

export default UserMovies;