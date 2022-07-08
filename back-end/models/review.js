const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    year: { type: Number, required: true },
    review: { type: String, required: true },
    poster: { type: String, required: true },
    rate: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true , ref: 'User' }
});

module.exports = mongoose.model('Review', reviewSchema);