import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
    console.log(req.body)
    const { fullname, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
            fullname: fullname,
            email,
            password: hashedPassword,
        });
        const token = generateToken(newUser._id, res);
        await newUser.save();
        // Generate JWT token

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Inavalid credentials" });
        }
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error is login controller", error.message)
    }

}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
}

export const checkAuth = async (req, res) => {
    try {
        // Get the user ID from the authenticated request
        const userId = req.user._id;
        
        console.log(userId)
        // Fetch the full user document from the database
        // Using select("-password") to exclude the password field
        const freshUserData = await User.findById(userId).select("-password");
        console.log(freshUserData)
        // If user not found, return error
        if (!freshUserData) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Return the fresh user data from the database
        res.status(200).json(freshUserData);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
