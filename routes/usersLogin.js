import express from "express";
import bcrypt from 'bcrypt';

import User from '../models/user.js';

const router = express.Router();
const log = console.log;
const clear = console.clear;

router.post('/', async (req, res) => { clear();
    try {

        const { userName, passWord } = req.body;
        log(userName, passWord);
    
        if (!userName || !passWord) { res.status(200).json({ message:
            'Username or Password is missing!' }); return; };
    
        const searchedUser = await User.findOne({ userName });
        log(searchedUser);
    
        if (!searchedUser) { res.status(200).json({ message: 'User doesn\'t exist!' });
            return; };

        const passwordCorrect = await bcrypt.compare(passWord, searchedUser.hash);
        log(passwordCorrect);
        if (!passwordCorrect) { res.status(200).json({ message: 'Password is incorrect!' });
            return; };
    
        res.status(200).json({ message: 'You are successful logged in!' });
        return;
        
    } catch (err) {
        log('Caught Error on POST /users-login', err);
        res.status(200).json({ message: 'Something went wrong!' });
        return;
    }
});

export default router;