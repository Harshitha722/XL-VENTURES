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

const memoryRoutes =
    require("./routes/memoryRoutes");

const dashboardRoutes =
    require("./routes/dashboardRoutes");

const customerRoutes =
    require("./routes/customerRoutes");

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
            "RenewAI Backend Running 🚀"
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
 * GET /api/dashboard/:customerId
 */
app.use(
    "/api/dashboard",
    dashboardRoutes
);


/**
 * =========================
 * Customer APIs
 * =========================
 *
 * GET /api/customers
 * GET /api/customers/:customerId
 */
app.use(
    "/api/customers",
    customerRoutes
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
 * GET /api/risk-score/:customerId
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
 * GET /api/timeline/:customerId
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
        `🚀 RenewAI Backend running on port ${PORT}`
    );
});