import express from "express";
import Chat from '../models/chat.js';
import User from '../models/user.js';
import Message from '../models/message.js';

const router = express.Router();
const log = console.log;
const clear = console.clear;

router.route('/')

    .post( async (req, res) => { clear();
        try {
            log(req.body);

            const { participants, from, note } = req.body;
            log(participants);

            if (!participants || !from || !note) { res.status(200).json({ message:
                'participants or from or note is missing!' }); return; };

            participants.sort();
            log(participants);

            const existsChat = await Chat.findOne({ participants });
            log(existsChat);

            if (!existsChat) {
                const newChat = new Chat({ participants });
                log(newChat);

                const savedChat = await newChat.save();
                log(savedChat);

                const newMessage = new Message({ from, note });
                log(newMessage);

                const savedMessage = await newMessage.save();
                log(savedMessage);

                const updatedChat = await Chat.updateOne({ participants },
                    { $push: { messages: newMessage } });
                log(updatedChat);

            } else {

                const newMessage = new Message({ from, note });
                log(newMessage);

                const savedMessage = await newMessage.save();
                log(savedMessage);

                const updatedChat = await Chat.updateOne({ participants },
                    { $push: { messages: newMessage } });
                log(updatedChat);

            }

            res.status(200).json({ message: 'Your Message is successful saved!' });
            return;
        } catch (err) {
            log('Caught Error on POST /chats', err);
            res.status(200).json({ message: 'Something went wrong!' }); return;
        }
    })

router.route('/:_id')

    .get( async (req, res) => { clear();
        try {
            const { _id } = req.params;

            if (!_id) { res.status(200).json({ message: '_id is missing!' }); return; };

            const searchedChat = await Chat.findOne({ _id })
                .populate('messages');

            if (!searchedChat) { res.status(200).json({ message: 'Chat not found!' }); return; };

            searchedChat.messages.map( async (message) => {
                const user = await User.findOne({ _id: message.from });

                log(`${user.userName}: ${message.note}`);
            });
        
            res.status(200).json({ message: 'Here is your Chat!', searchedChat });
            return;

        } catch (err) {

            log('Caught Error on GET /chats', err);
            res.status(200).json({ message: 'Something went wrong!' }); return;

        }
    })

    .put( async (req, res) => { clear();
        try {
            const { _id } = req.params;
            log(req.body);

            if (!_id) { res.status(200).json({ message: '_id is missing!' }); return; };

            const updatedMessage = await Message.updateOne({ _id }, req.body);
            log(updatedMessage);

            res.status(200).json({ message: 'Your message is updated!', updatedMessage });
            return;

        } catch (err) {

            log('Caught Error on PUT /chats', err);
            res.status(200).json({ message: 'Something went wrong!' }); return;

        }

    })

    .delete( async (req, res) => { clear();
        try {

            log(req.params._id);

            const { _id } = req.params;

            if (!_id) { res.status(200).json({ message: '_id is missing!' }); return; };

            const deletedMessage = await Message.deleteOne({ _id });
            log(deletedMessage);

            res.status(200).json({ message: 'Your message is deleted!' });
            return;

        } catch (err) {

            log('Caught Error on PUT /chats', err);
            res.status(200).json({ message: 'Something went wrong!' }); return;

        }   
    });

export default router;