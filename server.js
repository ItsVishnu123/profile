require("dotenv").config(); // Load .env file

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Nodemailer with secure credentials
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Secure email from .env
        pass: process.env.EMAIL_PASS, // Secure password from .env (App Password)
    },
});

// Contact form endpoint
app.post("/submit", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER, // Use Gmail from .env
        to: process.env.EMAIL_USER, // Receive emails here
        subject: `New Contact Form Submission from ${name}`,
        text: `Message: ${message}\n\nFrom: ${name}\nEmail: ${email}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Error sending email" });
        }
        res.status(200).json({ status: "success", message: "Email sent successfully!" });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
