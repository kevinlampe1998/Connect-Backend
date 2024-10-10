import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    eMail: { type: String, required: true, unique: true },
    birthDay: { type: String, required: true },
    hash: { type: String, required: true }
});

export default mongoose.model('User', userSchema);