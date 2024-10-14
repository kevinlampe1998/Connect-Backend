import express from "express";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import User from '../models/user.js';

dotenv.config();
const env = process.env;

const router = express.Router();
const log = console.log;
const clear = console.clear;

router.post('/', async (req, res) => { clear();
    try {

        const { firstName, lastName, userName, eMail, birthDay, passWord } = req.body;
        log(req.body);
    
        if ( !firstName || !lastName || !userName || !eMail || !birthDay ||
            !passWord ) { res.status(200).json({ message: 'At least One Input is missing!' });
            return; };
    
        const existUserName = await User.findOne({ userName });
        log(existUserName);
        if (existUserName) { res.status(200).json({ message: 'Username exists already!' });
            return; };
    
        const hash = await bcrypt.hash(passWord, env.SALT);
        log(hash);
    
        const newUser = User({ firstName, lastName, userName, eMail,
            birthDay, hash });
        log(newUser);
    
        const savedUser = await newUser.save();
        log(savedUser);
    
        res.status(200).json({ message: 'You are successful registered!' });
        return;

    } catch (err) {
        log('Caught Error on POST /users-register', err);
        res.status(200).json({ message: 'Something went wrong!' });
        return;
    }
});

export default router;