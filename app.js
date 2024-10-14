import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import chatRoute from './routes/chatRoute.js';
import usersRegister from './routes/usersRegister.js';
import usersLogin from './routes/usersLogin.js';
import friendsRoute from './routes/friendsRoute.js';

dotenv.config();
const env = process.env;

const app = express();
const log = console.log;
const clear = console.clear;

mongoose.connect(env.MONGODB_URI).then(() => log('MONGO DB connected!'))
    .catch((err) => log('Error connecting MONGO DB!: ', err))

app.use(cors());
app.use(express.json());

app.use('/users-register', usersRegister);
app.use('/users-login', usersLogin);
app.use('/chats', chatRoute);
app.use('/friends', friendsRoute);


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


