import ChatMessage from "../models/ChatMessage.model.js";



export const getUserForTopBar = async (request, response) => {
    try {
        const loggedInUser = request.user._id;
        const filteredUsers = await ChatMessage.find({ _id: { $ne: loggedInUser } }).select("-password");

        return response.status(200).json({ message: "User TopBar find success..", filteredUsers });
    } catch (err) {
        return response.status(500).json({ error: "Internal Server Error..." });
    }
}

export const getMessages = async (request, response) => {
    try {
        const { id: userToChatId } = request.params;
        const myId = request.user._id;

        const messages = await ChatMessage.find({
            $or: [
                {
                    senderId: myId, receiverId: userToChatId
                },
                {
                    senderId: userToChatId, receiverId: myId
                }
            ]
        });

        return response.status(200).json({ message:"Message get success..", messages });
    }
    catch (err) {
        return response.status(500).json({ error: "Internal Server error.." });
    }
}

export const sendMessages = async (request, response) => {
    try {
        
        const { text } = request.body;
        const { id: receiverId } = request.params;
        const senderId = request.user._id;

        const newMessage = new ChatMessage({
            senderId,
            receiverId,
            text
       })
        await newMessage.save();
        return response.status(201).json({ message: "Message send to User Successfully..." });
    }
    catch (err) {
        return response.status(500).json({ error: "Internal Server Error..." });
    }
}