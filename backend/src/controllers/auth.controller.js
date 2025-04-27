import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateToken } from "../lib/util.js";

export const signup = async (req, res) => {
    // console.log(req.body)
    const { fullName, email, password } = req.body;
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
            fullname: fullName,
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
export const testup=(req,res)=>{
    res.send("login route");
}
export const login=(req,res)=>{
    res.send("login route");
}
export const logout=(req,res)=>{
    res.send("logout route")
}
