const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.post('/signup', fileUpload.single('image'),
    [check('name').not().isEmpty(), 
     check('email').normalizeEmail().isEmail(), 
     check('password').isLength({ min: 6 })], userControllers.signup);
router.post('/login', userControllers.login);
router.get('/', userControllers.getUsers);

module.exports = router;