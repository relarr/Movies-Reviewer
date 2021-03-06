const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const HttpError = require('./models/http-error');

const moviesRoutes = require('./routes/movies-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/movies', moviesRoutes);

app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    return next(new HttpError('Could not find that route', 404));
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }

    if (res.headerSent) return next(error);

    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred'});
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hk6ox.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(() => {
    app.listen(process.env.PORT || 5000);
}).catch(err => {
    console.log(err);
});
