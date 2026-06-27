/**
 * RENEWAI SERVER
 *
 * Main entry point for the backend.
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


const app = express();

const PORT = 5000;


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
 * Start Express Server
 * =========================
 */
app.listen(PORT, () => {

    console.log(
        `🚀 RenewAI Backend running on port ${PORT}`
    );
});