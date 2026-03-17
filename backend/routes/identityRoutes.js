const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register a new user profile
router.post("/register", async (req, res) => {
    try {
        const { walletAddress, name, email } = req.body;
        
        let user = await User.findOne({ walletAddress });
        if (user) {
            return res.status(400).json({ error: "User already exists with this wallet address." });
        }
        
        user = new User({ walletAddress, name, email });
        await user.save();
        
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

// Fetch user profile by wallet address
router.get("/profile/:walletAddress", async (req, res) => {
    try {
        const user = await User.findOne({ walletAddress: req.params.walletAddress });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
