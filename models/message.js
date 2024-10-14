import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    note: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);