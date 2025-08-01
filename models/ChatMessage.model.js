import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "matchrequest",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "matchrequest",
        required: true
    },
    text: {
        type: String
    }
}, { timestamps: true, versionKey: false });

const ChatMessage = mongoose.model("chat", ChatMessageSchema);

export default ChatMessage;