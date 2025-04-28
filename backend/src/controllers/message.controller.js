import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        // Exclude the logged-in user from the sidebar
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select("_id fullname email profilePic");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
}

export const getMessage = async (req, res) => {
   try {
      const userId = req.user._id;
      const otherUserId = req.params.id;
      // Find messages where senderId/receiverId are either userId or otherUserId
      const messages = await Message.find({
         $or: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId }
         ]
      }).sort({ timestamp: 1 }); // oldest to newest
      res.status(200).json(messages);
   } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages", error: error.message });
   }
}

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const { content, image } = req.body;

        if (!content && !image) {
            return res.status(400).json({ message: "Message content or image is required" });
        }

        let imageUrl = '';
        if (image) {
            // Upload image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "chat-app/messages"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            content: content || '',
            image: imageUrl
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
}