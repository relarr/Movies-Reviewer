const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Movie = require('../models/movie');
const User = require('../models/user');

const getMovieById = async (req, res, next) => {
    const movieId = req.params.mid;

    let movie;
    try {
        movie = await Movie.findById(movieId);
    } catch (err){
        return next(new HttpError('Could not find that movie (getMovieById)', 500));
    }

    if (!movie) return next(new HttpError('Could not find that movie', 404));

    res.json({ movie: movie.toObject({ getters: true })});
};

const getMoviesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userMovies;
    try {
        userMovies =  await Movie.find({ creator: userId });
    } catch (err){
        return next(new HttpError('Could not find any movies for that id', 500));
    }

    if (userMovies.length === 0) return next(new HttpError('Could not find any movies for that user id', 404));

    res.json({ userMovies: userMovies.map(movie => movie.toObject({ getters: true })) });
};

const createMovie = async (req, res, next) => {
    if (!validationResult(req).isEmpty()) return next(new HttpError('Invalid inputs (create movie)', 422));

    const { title, director, year, review, image, rate } = req.body;
    const createdMovie = new Movie({
        title,
        director,
        year,
        review,
        image,
        rate,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err){
        return next(new HttpError('Error finding user with that id', 500));
    }

    if (!user) return next(new HttpError('Could not find a user with that id', 404));

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdMovie.save({ session: sess });
        user.movies.push(createdMovie);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err){
        return next(new HttpError('Creating movie review failed', 500));
    }

    res.status(201).json({movie: createdMovie});
};

const updateMovie = async (req, res, next) => {
    if (!validationResult(req).isEmpty()) return next(new HttpError('Invalid inputs (update movie)', 422));

    const { review, rate } = req.body;
    const movieId = req.params.mid;

    let updatedMovie;
    try {
        updatedMovie = await Movie.findById(movieId);
    } catch (err){
        return next(new HttpError('Could not update movie review', 500));
    }

    if (updatedMovie.creator.toString() !== req.userData.userId){
        return next(new HttpError('You are not allowed to edit this review', 401));
    }

    updatedMovie.review = review;
    updatedMovie.rate = rate;

    try {
        await updatedMovie.save();
    } catch (err){
        return next(new HttpError('Saving updated movie review failed', 500));
    }
    
    res.status(200).json({movie: updatedMovie.toObject({ getters: true })});
};

const deleteMovie = async (req, res, next) => {
    const movieId = req.params.mid;
    
    let movie;
    try {
        movie = await Movie.findById(movieId).populate('creator');
    } catch (err){
        return next(new HttpError('Could not find movie review to delete', 500));
    }

    if (!movie) return next(new HttpError('Could not find a movie review linked to that id', 404));

    if (movie.creator.id !== req.userData.userId){
        return next(new HttpError('You are not allowed to delete this place', 401));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await movie.remove({session: sess});
        movie.creator.movies.pull(movie);
        await movie.creator.save({session: sess});
        await sess.commitTransaction();
    } catch (err){
        return next(new HttpError('Could not delete movie review', 500));
    }

    res.status(200).json({message: 'Movie Deleted'});
};

exports.getMovieById = getMovieById;
exports.getMoviesByUserId = getMoviesByUserId;
exports.createMovie = createMovie;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;