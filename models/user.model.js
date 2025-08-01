import mongoose, { set } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
        set: (value) => {
            console.log("setter executed...");
            const saltKey = bcrypt.genSaltSync(12);
            value = bcrypt.hashSync(value, saltKey);
            return value;
        }
    },
    contact: {
        type: Number,
      required:true  
    },
    bio: {
        type: String  
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    skillToTeach: {
        type: String
    },
    skillToLearn: {
        type: String
    },
    profile: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });

export const User = mongoose.model("user", UserSchema);