import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import Cloudnary from "../lib/cloudnary.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUserForSideBar", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userChatId } = req.params
        const senderId = req.user._id;

        const message = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userChatId },
                { senderId: userChatId, receiverId: senderId }
            ]
        });
        
        res.status(200).json(message);

    } catch (error) {
        console.log("Error in getUserForSideBar", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await Cloudnary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // Todo : real time functionality here +> Socket.io 

            res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in getUserForSideBar", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}