const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const { use } = require('../routes/users-routes');

const getUserById = (req, res, next) => {
    const userId = req.params.uid;
    const user = USERS.find(u => u.id === userId);

    if (!user) return next(new HttpError('Could not find user', 404));

    res.json({user});
};

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err){
        return next(new HttpError('Could not fetch users', 500));
    }

    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
    if (!validationResult(req).isEmpty()) return next(new HttpError('Invalid inputs (signup)', 422));

    const { name, email, password } = req.body;

    let userExists;
    try {
        userExists = await User.findOne({ email: email });
    } catch (err){
        return next(new HttpError('Signing up failed', 500));
    }

    if (userExists){
        return next(new HttpError('A user with that email already exists', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err){
        return next(new HttpError('Could not create user', 500));
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        movies: []
    });

    try {
        await createdUser.save();
    } catch (err){
        return next(new HttpError('Signing up failed. Could not save new user', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h'});
    } catch (err){
        return next(new HttpError('Signing up failed', 500));
    }
    
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    let userExists;
    try {
        userExists = await User.findOne({ email: email });
    } catch (err){
        return next(new HttpError('Logging in failed', 500));
    }

    if (!userExists) return next(new HttpError('Invalid credentials', 403));

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, userExists.password);
    } catch (err){
        return next(new HttpError('Could not log in', 500));
    }

    if (!isValidPassword) return next(new HttpError('Invalid password', 403));

    let token;
    try {
        token = jwt.sign(
            { userId: userExists.id, email: userExists.email },
            process.env.JWT_KEY,
            { expiresIn: '1h'});
    } catch (err){
        return next(new HttpError('Login in failed', 500));
    }

    res.status(201).json({ userId: userExists.id, email: userExists.email, token });
};

exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;