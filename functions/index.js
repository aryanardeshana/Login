const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const stickersData = require("./data/stickers.json");
const effectsData = require("./data/effects.json");
const backgroundsData = require("./data/backgrounds.json");
const graphicsData = require("./data/graphics.json");
const categoriesData = require("./data/categories.json");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecretkey";

/* MONGODB CONNECTION  */

const MONGO_URI = functions.config().mongo.uri;
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    await mongoose.connect(MONGO_URI);

    isConnected = true;

    console.log("MongoDB Connected");
};

connectDB();

/* TEST API */

app.get("/", (req, res) => {
    res.json({
        message: "API Working"
    });
});

app.get("/response", (req, res) => {
    res.json({
        message: "Hello from server"
    });
});

/* USER SCHEMA  */

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    premium: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("User", UserSchema);

/* REGISTER  */

app.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            message: "User registered successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
});

/*  LOGIN  */

app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                name: user.name,
                email: user.email,
                premium: user.premium
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
});

/* RESET PASSWORD */

app.post("/reset-password/:token", async (req, res) => {

    try {

        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({ email: token });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        user.password = hashedPassword;

        await user.save();

        res.json({
            message: "Password reset successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* CHANGE PASSWORD */

app.post("/change-password", async (req, res) => {

    try {

        const { email, oldPassword, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        user.password = hashedPassword;

        await user.save();

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* UPGRADE PREMIUM */

app.post("/upgrade-premium", async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.premium = true;

        await user.save();

        res.json({
            message: "User upgraded to premium"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* USERS */

app.get("/users", async (req, res) => {

    try {

        const users = await User.find().select("-password").lean();

        res.json(users);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* DELETE USER WITH EMAIL PASSWORD */

app.post("/delete-user", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        await User.deleteOne({ email });

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* STICKERS API */

app.get("/stickers", (req, res) => {

    res.json({
        success: true,
        stickers: stickersData.stickers
    });

});

/* EFFECTS API */

app.get("/effects", (req, res) => {

    res.json({
        success: true,
        effects: effectsData.effects
    });

});

/* BACKGROUNDS API */

app.get("/backgrounds", (req, res) => {

    res.json({
        success: true,
        backgrounds: backgroundsData.backgrounds
    });

});

/* GRAPHICS API */

app.get("/graphics", (req, res) => {
    res.json({
        success: true,
        graphics: graphicsData.graphics
    });
});

/* CATEGORIES API */

app.get("/categories", (req, res) => {
    res.json({
        success: true,
        categories: categoriesData.categories
    });
});

/* EXPORT */

exports.api = functions.https.onRequest(app);