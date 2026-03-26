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
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Swagger UI
// Swagger JSON
app.get("/docs-json", (req, res) => {
    res.json(swaggerSpec);
});

// Swagger UI (HTML)
app.get("/docs", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Swagger UI</title>
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
        </head>
        <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
            <script>
               SwaggerUIBundle({
    url: 'https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api/docs-json',
    dom_id: '#swagger-ui',
});
            </script>
        </body>
        </html>
    `);
});

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

/* AUTH MIDDLEWARE */

const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "No token, access denied"
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

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
    name: {
        type: String,
        required: true   // name must
    },

    email: {
        type: String,
        required: true,
        unique: true     //  duplicate email block
    },

    password: {
        type: String,
        required: true   //  password must
    },

    premium: {
        type: Boolean,
        default: false
    },

    otp: String,
    otpExpire: Date
});

const User = mongoose.model("User", UserSchema);

/* REGISTER  */
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aryan
 *               email:
 *                 type: string
 *                 example: aryan@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User registered successfully
 */
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
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: aryan@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 */
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
            user: functions.config().gmail.email,
            pass: functions.config().gmail.pass
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
/**
 * @swagger
 * /verify-otp-reset:
 *   post:
 *     summary: Verify OTP and reset password
 *     description: Verify OTP and set new password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: aryan@gmail.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Password reset successful
 */
app.post("/verify-otp-reset", async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            message: "All fields required"
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
});

/* CHANGE PASSWORD */
/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change user password
 *     description: User can change password using old password
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: 654321
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Old password incorrect / User not found
 */
app.post("/change-password", authMiddleware, async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

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
/**
 * @swagger
 * /update-profile:
 *   post:
 *     summary: Update user profile
 *     description: Update user's name
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aryan Patel
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
app.post("/update-profile", authMiddleware, async (req, res) => {

    try {

        const { name } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = name;

        await user.save();

        res.json({
            message: "Profile updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* UPGRADE PREMIUM */
/**
 * @swagger
 * /upgrade-premium:
 *   post:
 *     summary: Upgrade user to premium
 *     description: Set user premium status to true
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: aryan@gmail.com
 *     responses:
 *       200:
 *         description: User upgraded to premium
 *       404:
 *         description: User not found
 */
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
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Fetch all users from database
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
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
/**
 * @swagger
 * /delete-user:
 *   post:
 *     summary: Delete user account
 *     description: Delete user using password verification
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid password
 *       404:
 *         description: User not found
 */
app.post("/delete-user", authMiddleware, async (req, res) => {

    try {

        const { password } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        //  Password verify (extra security)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        await User.deleteOne({ _id: req.user.id });

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/* STICKERS API */
/**
 * @swagger
 * /stickers:
 *   get:
 *     summary: Get all stickers
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: List of stickers
 */
app.get("/stickers", (req, res) => {

    res.json({
        success: true,
        stickers: stickersData.stickers
    });

});

/* EFFECTS API */
/**
 * @swagger
 * /effects:
 *   get:
 *     summary: Get all effects
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: List of effects
 */
app.get("/effects", (req, res) => {

    res.json({
        success: true,
        effects: effectsData.effects
    });

});

/* BACKGROUNDS API */
/**
 * @swagger
 * /backgrounds:
 *   get:
 *     summary: Get all backgrounds
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: List of backgrounds
 */
app.get("/backgrounds", (req, res) => {

    res.json({
        success: true,
        backgrounds: backgroundsData.backgrounds
    });

});

/* GRAPHICS API */
/**
 * @swagger
 * /graphics:
 *   get:
 *     summary: Get all graphics
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: List of graphics
 */
app.get("/graphics", (req, res) => {
    res.json({
        success: true,
        graphics: graphicsData.graphics
    });
});

/* CATEGORIES API */
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: List of categories
 */
app.get("/categories", (req, res) => {
    res.json({
        success: true,
        categories: categoriesData.categories
    });
});

/* CALENDAR API */
/**
 * @swagger
 * /calendar/holidays:
 *   get:
 *     summary: Get all holidays
 *     tags: [Calendar]
 *     responses:
 *       200:
 *         description: List of holidays
 */
app.get("/calendar/holidays", (req, res) => {

    res.json({
        success: true,
        count: calendarData.holidays.length,
        holidays: calendarData.holidays
    });

});

/* ALL APIs LIST */
/**
 * @swagger
 * /all-apis:
 *   get:
 *     summary: Get all API endpoints list
 *     tags: [System]
 *     responses:
 *       200:
 *         description: List of all APIs
 */
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