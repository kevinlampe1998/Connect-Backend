import mongoose, { mongo } from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

export default mongoose.model('Chat', chatSchema);