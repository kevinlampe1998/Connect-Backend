import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    involved: { type: String, required: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

export default mongoose.model('Chat', chatSchema);