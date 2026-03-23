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
const calendarData = require("./data/calendar.json");

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
    },

    otp: String,
    otpExpire: Date
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

// nodemailer
const nodemailer = require("nodemailer");

app.post("/forgot-password", async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 300000;

    await user.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "www.aryanpatel3772@gmail.com",
            pass: "kpof cxoz lptk vnti"
        }
    });

    await transporter.sendMail({
        to: email,
        subject: "OTP",
        html: `<h2>Your OTP: ${otp}</h2>`
    });

    res.json({ message: "OTP sent successfully" });
});

/* RESET PASSWORD */

app.post("/verify-otp-reset", async (req, res) => {

    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // OTP check
    if (user.otp !== otp || user.otpExpire < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);

    user.password = hashedPassword;

    // OTP clear
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
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

/* UPDATE PROFILE (CHANGE NAME) */

app.post("/update-profile", async (req, res) => {

    try {

        const { email, name } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = name;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email
            }
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

/* CALENDAR API */

app.get("/calendar/holidays", (req, res) => {

    res.json({
        success: true,
        count: calendarData.holidays.length,
        holidays: calendarData.holidays
    });

});

/* ALL APIs LIST */

app.get("/all-apis", (req, res) => {

    const apis = [
        { name: "Register API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/register" },
        { name: "Login API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/login" },
        { name: "Users API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/users" },
        { name: "Base API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api" },
        { name: "Upgrade Premium API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/upgrade-premium" },
        { name: "Delete User API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/delete-user" },
        { name: "Stickers API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/stickers" },
        { name: "Effects API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/effects" },
        { name: "Change Password API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/change-password" },
        { name: "Backgrounds API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/backgrounds" },
        { name: "Graphics API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/graphics" },
        { name: "Categories API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/categories" },
        { name: "Calendar API", url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/calendar/holidays" }
    ];

    res.json({
        success: true,
        count: apis.length,
        data: apis
    });

});

/* EXPORT */

exports.api = functions.https.onRequest(app);