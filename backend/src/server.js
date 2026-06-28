/**
 * RENEWAI SERVER
 *
 * Main backend entry point.
 */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!GEMINI_API_KEY) {
    console.warn(
        "WARNING: GEMINI_API_KEY or GOOGLE_API_KEY is not configured. " +
        "Gemini requests will fail and the app will fall back to heuristic behavior. " +
        "Create backend/.env from backend/.env.example and set your API key."
    );
}

// Route Imports
const orchestrationRoutes =
    require("./routes/orchestrationRoutes");

const uploadRoutes =
    require("./routes/uploadRoutes");

const latestAnalysisRoutes =
    require("./routes/latestAnalysisRoutes");

const memoryRoutes =
    require("./routes/memoryRoutes");

const dashboardRoutes =
    require("./routes/dashboardRoutes");

const architectureRoutes =
    require("./routes/architectureRoutes");

const riskRoutes =
    require("./routes/riskRoutes");

const timelineRoutes =
    require("./routes/timelineRoutes");

const metricsRoutes =
    require("./routes/metricsRoutes");

const knowledgeRoutes =
    require("./routes/knowledgeRoutes");

const businessRulesRoutes =
    require("./routes/businessRulesRoutes");

const scenarioRoutes =
    require("./routes/scenarioRoutes");

const devilsAdvocateRoutes =
    require("./routes/devilsAdvocateRoutes");


const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectToDatabase = async () => {
    if (!MONGO_URI) {
        console.warn("MONGO_URI is not set. Skipping MongoDB connection.");
        return;
    }

    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

connectToDatabase();


/**
 * =========================
 * Global Middlewares
 * =========================
 */
app.use(cors());

app.use(express.json());


/**
 * =========================
 * Health Check
 * =========================
 */
app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "RenewAI Backend Running"
    });
});


/**
 * =========================
 * AI Orchestration APIs
 * =========================
 *
 * POST /api/orchestrate
 */
app.use(
    "/api/orchestrate",
    orchestrationRoutes
);

/**
 * =========================
 * Upload-Driven Analysis APIs
 * =========================
 *
 * POST /api/upload/analyze
 * GET  /api/latest-analysis
 */
app.use(
    "/api/upload",
    uploadRoutes
);

app.use(
    "/api/latest-analysis",
    latestAnalysisRoutes
);


/**
 * =========================
 * Shared Memory APIs
 * =========================
 *
 * GET  /api/memory
 * POST /api/memory/review
 */
app.use(
    "/api/memory",
    memoryRoutes
);


/**
 * =========================
 * Dashboard APIs
 * =========================
 *
 * GET /api/dashboard
 */
app.use(
    "/api/dashboard",
    dashboardRoutes
);


/**
 * =========================
 * Architecture APIs
 * =========================
 *
 * GET /api/architecture
 */
app.use(
    "/api/architecture",
    architectureRoutes
);


/**
 * =========================
 * Risk Score APIs
 * =========================
 *
 * GET /api/risk-score
 */
app.use(
    "/api/risk-score",
    riskRoutes
);


/**
 * =========================
 * Renewal Timeline APIs
 * =========================
 *
 * GET /api/timeline
 */
app.use(
    "/api/timeline",
    timelineRoutes
);

app.use(
    "/api/metrics",
    metricsRoutes
);

app.use(
    "/api/knowledge",
    knowledgeRoutes
);

app.use(
    "/api/scenario-analysis",
    scenarioRoutes
);

app.use(
    "/api/devils-advocate",
    devilsAdvocateRoutes
);

app.use(
    "/api/business-rules",
    businessRulesRoutes
);


/**
 * =========================
 * 404 Handler
 * =========================
 */
app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"
    });
});


/**
 * =========================
 * Start Server
 * =========================
 */
app.listen(PORT, () => {

    console.log(
        `RenewAI Backend running on port ${PORT}`
    );
});
