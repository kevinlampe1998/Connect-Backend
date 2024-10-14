import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';

import User from './models/user.js';
import Message from './models/message.js';
import Chat from './models/chat.js';

import chatRoute from './routes/chatRoute.js';

dotenv.config();

const app = express();
const env = process.env;
const log = console.log;
const clear = console.clear;

mongoose.connect(env.MONGODB_URI).then(() => log('MONGO DB connected!'))
    .catch((err) => log('Error connecting MONGO DB!: ', err))

app.use(cors());
app.use(express.json());

app.use('/chats', chatRoute);

app.post('/users-register', async (req, res) => { clear();
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

app.post('/users-login', async (req, res) => { clear();
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

app.listen(env.PORT, () => ( clear(),
    log(`Server started on http://localhost:${env.PORT}`)));

// {
//     "firstName": "Kevin Thomas",
//     "lastName": "Lampe",
//     "userName": "lampe.kevin",
//     "eMail": "lampekevin@mail.com",
//     "birthDay": "31.07.1998",
//     "passWord": "My$ecur3dPaßw0rd"
// }

// {
//     "firstName": "Super",
//     "lastName": "Man",
//     "userName": "super.man",
//     "eMail": "superman@mail.com",
//     "birthDay": "01.01.1000",
//     "passWord": "$uperPaßw0rd"
// }


// {
//     "participants": ["670651a8068bd8c4ab78049f", "67070d4a23988e27768e407c"],
//     "from": "67070d4a23988e27768e407c"
//     "note": "Hey Superman, how you re doing?" 
// }