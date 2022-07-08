const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Review = require('../models/review');
const User = require('../models/user');

const createReview = async (req, res, next) => {
    if (!validationResult(req).isEmpty()){
        res.status(422).json({ message: 'Invalid inputs (create reaview)' });
        return;
    }

    const { title, director, year, review, poster, rate } = req.body;
    
    const createdReview = new Review({
        title, director, year, review, poster, rate, creator: req.userInfo.userId
    });
    
    let user;
    try {
        user = await User.findById(req.userInfo.userId);
    } catch(err){
        res.status(500).json({ message: 'Error finding user with that id' });
        return;
    }

    if (!user) {
        res.status(404).json({ message: 'Could not find a user with that id' });
        return;
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdReview.save({ session: sess });
        user.reviews.push(createdReview);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err){
        res.status(500).json({ message: 'Creating new review failed' });
        return;
    }

    res.status(201).json({ review: createdReview });
};

const updateReview = async (req, res, next) => {
    if (!validationResult(req).isEmpty()){
        res.status(422).json({ message: 'Invalid inputs (update review)'});
        return;
    }

    const { updatedReview, updatedRate } = req.body;
    const reviewId = req.params.rid;

    let review;
    try {
        review = await Review.findById(reviewId);
    } catch (err){
        res.status(500).json({ message: 'Could not update review' });
        return;
    }

    if (review.creator.toString() !== req.userInfo.userId){
        res.status(401).json({ message: 'You are not allowed to edit this review' });
        return;
    }

    review.review = updatedReview;
    review.rate = updatedRate;

    try {
        await review.save();
    } catch (err){
        res.status(500).json({ message: 'Saving update failed' });
        return;
    }

    res.status(200).json({ review: review.toObject({ getters: true })});
};

const deleteReview = async (req, res, next) => {
    const reviewId = req.params.rid;

    let review;
    try {
        review = await Review.findById(reviewId).populate('creator');
    } catch (err){
        res.status(500).json({ message: 'Could not find review' });
        return;
    }

    if (!review) {
        res.status(404).json({ message: 'Could not find review to delete' });
        return;
    }

    if (review.creator.id !== req.userInfo.userId){
        res.status(401).json({ message: 'You are not allowed to delete this review' });
        return;
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await review.remove({ session: sess });
        review.creator.reviews.pull(review);
        await review.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err){
        res.status(500).json({ message: 'Could not delete review' });
        return;
    }

    res.status(200).json({ message: 'Review deleted' });
};

const getReviews = async (req, res, next) => {
    let userReviews;
    try {
        userReviews = await Review.find({ creator: req.params.uid });
    } catch (err){
        res.status(500).json({ message: 'Could not find any reviews for that user id' });
        return;
    }

    if (userReviews.length === 0){
        res.status(404).json({ message: 'User doesn\'t have any reviews' });
        return;
    }

    res.json({ userReviews: userReviews.map(review => review.toObject({ getters: true }))});
};

exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
exports.getReviews = getReviews;