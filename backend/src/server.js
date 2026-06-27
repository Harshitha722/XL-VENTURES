// Import required packages
const express = require("express");
const cors = require("cors");

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "RenewAI Backend Running"
    });
});

// Port configuration
const PORT = 5000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});