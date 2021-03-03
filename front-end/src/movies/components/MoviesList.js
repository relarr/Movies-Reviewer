import React from 'react';

import Movie from './Movie';

const MoviesList = props => {
    return (
        <div>{props.userMovies.map(movie => 
            <Movie 
                id={movie.id}
                key={movie.id}
                title={movie.title}
                director={movie.director}
                year={movie.year}
                review={movie.review}
                image={movie.image}
                rate={movie.rate}
                creatorId={movie.creator}
                onDelete={props.onDeleteMovie} /> )}
        </div>
    );
};

export default MoviesList;