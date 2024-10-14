import express from "express";
import FriendsList from "../models/friendsList.js";
import User from "../models/user.js";

const router = express.Router();
const log = console.log;

router.route('/').post( async (req, res) => {
    try {
        const { user_id, friend } = req.body;
        log(user_id, friend);

        const friendsList = await FriendsList.findOne({ user_id });
        log(friendsList);

        if (!friendsList) {
            const newFriendsList = new FriendsList({ user_id });
            log(newFriendsList);

            const savedFriendsList = await newFriendsList.save();
        }

        const friends = await FriendsList.findOne({ user_id })
            .populate('friends');
        log('friends', friends.friends);
        log('friends', Array.isArray(friends));

        const existFriend = friends.friends.some(f => {
            log(f);
            log(f.id);
            log(friend);
            log(f.id === friend);
            return f.id === friend
        });
        log(existFriend);

        if (existFriend) {
            res.json({ message: 'You added already this friend!' });
            return; };

        const updatedFriendsList = await FriendsList.updateOne({ user_id },
            { $push: { friends: friend } });

        const friendsData = await User.findOne({ _id: friend });
        log(friendsData);

        res.status(200).json({ message: `You added ${friendsData.userName}` });
        return;

    } catch (err) {
        res.json('Something went wrong!');
        log('Error on POST /friends', err);
        return;
    }
})

router.route('/:user_id').get( async (req, res) => {
    const { user_id } = req.body;

    const friendsOfUser = await FriendsList.findOne({ user_id })
        .populate('friends');

    const friends = friendsOfUser.friends;

    res.json({ message: 'Here are the friends from the user',
        friends }); return;
});

export default router;

// {
//     "user_id": "670651a8068bd8c4ab78049f",
//     "friend": "67070d4a23988e27768e407c"
// }