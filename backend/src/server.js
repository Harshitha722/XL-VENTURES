/**
 * RENEWAI SERVER
 *
 * Main backend entry point.
 */

const express = require("express");
const cors = require("cors");

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


const app = express();

const PORT = process.env.PORT || 5000;


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
