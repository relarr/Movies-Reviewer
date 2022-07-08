const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { uploadFile } = require('../middleware/s3');

const signup = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.status(401).json({ message: 'Invalid input' });
        return;
    }

    const { name, email, password } = req.body;    

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err){
        res.json({ message: 'signing up failed'});
        return;
    }

    if (existingUser){
        res.status(403).json({ message: 'user already exists' });
        return;
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err){
        res.json({ message: 'hashing password failed' });
        return;
    }

    let uploadedImage;
    try {
        uploadedImage = await uploadFile(req.file);
    } catch (err) {
        res.json({ message: 'uploading user image failed' });
        return;
    }

    const createdUser = new User({
        name, email, password: hashedPassword, image: uploadedImage.Location
    });

    try {
        await createdUser.save();
    } catch (err){
        res.json({ message: 'saving new user failed' });
        return;
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err){
        res.json({ message: 'jwt sign failed (sign in)' });
        return;
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async(req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err){
        res.json({ message: 'loging in failed' });
        return;
    }

    if (!existingUser){
        res.status(401).json({ message: 'invalid credentials' });
        return;
    }

    let passwordIsValid = false;
    try {
        passwordIsValid = await bcrypt.compare(password, existingUser.password);
    } catch (err){
        res.json({ message: 'bcrypt compare failed' });
        return;
    }

    if (!passwordIsValid){
        res.status(401).json({ message: 'invalid password' });
        return;
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err){
        res.json({ message: 'jwt sign failed (log in)' });
        return;
    }

    res.status(200).json({ userId: existingUser.id, email: existingUser.email, token });
};

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err){
        res.status(500).json({ message: 'could not fetch users' });
        return;
    }

    res.json({ users: users.map(user => user.toObject({ getters: true }))});
};

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;