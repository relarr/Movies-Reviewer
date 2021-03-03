const express = require('express');
const { check } = require('express-validator');

const moviesController = require('../controllers/movies-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:mid', moviesController.getMovieById);

router.get('/user/:uid', moviesController.getMoviesByUserId);

router.use(checkAuth);

router.post('/', [check('title').not().isEmpty(),
                  check('director').not().isEmpty(),
                  check('year').not().isEmpty(),
                  check('review').isLength({min: 5})], moviesController.createMovie);

router.patch('/:mid', [check('review').isLength({min: 5})], moviesController.updateMovie);

router.delete('/:mid', moviesController.deleteMovie);

module.exports = router;