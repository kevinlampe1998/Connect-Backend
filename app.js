import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';

import User from './models/user.js';
import Message from './models/message.js';
import Chat from './models/chat.js';

dotenv.config();

const app = express();
const env = process.env;
const log = console.log;
const clear = console.clear;

mongoose.connect(env.MONGODB_URI).then(() => console.log('MONGO DB connected!'))
    .catch((err) => console.log('Error connecting MONGO DB!: ', err))

app.use(cors());
app.use(express.json());

app.post('/users-register', async (req, res) => { clear();
    try {

        const { firstName, lastName, userName, eMail, birthDay, passWord } = req.body;
        console.log(req.body);
    
        if ( !firstName || !lastName || !userName || !eMail || !birthDay ||
            !passWord ) { res.json({ message: 'At least One Input is missing!' });
            return; };
    
        const existUserName = await User.findOne({ userName });
        console.log(existUserName);
        if (existUserName) { res.json({ message: 'Username exists already!' });
            return; };
    
        const hash = await bcrypt.hash(passWord, env.SALT);
        console.log(hash);
    
        const newUser = User({ firstName, lastName, userName, eMail,
            birthDay, hash });
        console.log(newUser);
    
        const savedUser = await newUser.save();
        console.log(savedUser);
    
        res.json({ message: 'You are successful registered!' });
        return;

    } catch (err) {
        console.log('Caught Error on POST /users-register', err);
        res.json({ message: 'Something went wrong!' });
        return;
    }
});

app.post('/users-login', async (req, res) => { clear();
    try {

        const { userName, passWord } = req.body;
        console.log(userName, passWord);
    
        if (!userName || !passWord) { res.json({ message:
            'Username or Password is missing!' }); return; };
    
        const searchedUser = await User.findOne({ userName });
        console.log(searchedUser);
    
        if (!searchedUser) { res.json({ message: 'User doesn\'t exist!' });
            return; };

        const passwordCorrect = await bcrypt.compare(passWord, searchedUser.hash);
        console.log(passwordCorrect);
        if (!passwordCorrect) { res.json({ message: 'Password is incorrect!' });
            return; };
    
        res.json({ message: 'You are successful logged in!' });
        return;
        
    } catch (err) {
        console.log('Caught Error on POST /users-login', err);
        res.json({ message: 'Something went wrong!' });
        return;
    }
});

app.post('/chats', async (req, res) => { clear();
    try {
        console.log(req.body);
        const { from, to, note } = req.body;
        const orderedNames = [from, to].sort().join('&');
        log(orderedNames);

        const searchedChat = await Chat.findOne({ involved: orderedNames });
        console.log(searchedChat);

        if (!searchedChat) {

            const newChat = new Chat({ involved: orderedNames,
            });
            log(newChat);
            await newChat.save();

            const newMessage = new Message(req.body);
            log(newMessage);
            
            const updatedChat = await Chat.updateOne({ involved: orderedNames }, { $push: { messages: newMessage } });
            log(updatedChat);
            
            const savedMessage = await newMessage.save();

            log(savedMessage);

        } else {

            const newMessage = new Message(req.body);
            log(newMessage);
            
            const updatedChat = await Chat.updateOne({ involved: orderedNames }, { $push: { messages: newMessage } });
            log(updatedChat);

            const savedMessage = await newMessage.save();

            log(savedMessage);
        }




        // if (!searchedChat) {
        //     const newChat = new Chat({ involved: orderedNames, messages: [] });
        //     console.log(newChat);
        //     const savedChat = await newChat.save();
        //     console.log(savedChat);
        //     const newMessage = new Message(req.body);
        //     const savedMessage = await newMessage.save();
        // }

        res.json({ message: 'Your Message is successful saved!' });
        return;
    } catch (err) {
        console.log('Caught Error on POST /chats', err);
        res.json({ message: 'Something went wrong!' }); return;
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
//     "from": "lampe.kevin",
//     "to": "super.man",
//     "note": "Hey Superman, how you are doing?"
// }