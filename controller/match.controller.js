import { Match } from "../models/match.model.js";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

export const sendMatchRequest = async (request, response, next) => {
    try {
        let fromUserId = request.params.id;
        let { ToUserId } = request.body;

        const toUser = User.findOne(ToUserId);
        if (!toUser)
            return response.status(403).json({ message: "User not found." });

        const matchRequest = new Match({
            fromUserId,
            ToUserId
        });
        await matchRequest.save();

        return response.status(201).json({ message: "match Request send successfully...", matchRequest });
    } catch (err) {
        console.log(err);

        return response.status(500).json({ error: "Internal Server Error..." });
    }
};


export const fetchAllRequests = async (request, response, next) => {
    try {
        const allrequests = await Match.findOne().populate("fromUserId").populate("ToUserId");
        return response.status(200).json({ message: "ALL Requests", allrequests });
    } catch (err) {
        return response.status(500).json({ error: "Internal Server Error..." });
    }
};