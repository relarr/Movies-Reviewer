const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const reviewsController = require('../controllers/reviews-controllers');

const router = express.Router();

router.get('/user/:uid', reviewsController.getReviews);

router.use(checkAuth);
router.post('/', [check('review').isLength({ min: 5 }),
                  check('rate').not().isEmpty()], reviewsController.createReview);
router.patch('/:rid', [check('updatedReview').isLength({ min: 5 })], reviewsController.updateReview);
router.delete('/:rid', reviewsController.deleteReview);

module.exports = router;