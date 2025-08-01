import mongoose from "mongoose";

const matchRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    ToUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default :'pending'
    }

},{timestamps:true,versionKey:false});

export const Match = mongoose.model("matchrequest", matchRequestSchema);