/**
 * DASHBOARD ROUTES
 */

const express = require("express");

const {
    getDashboardData
} = require("../services/dashboardService");

const router = express.Router();


/**
 * GET /api/dashboard
 */
router.get("/", (req, res) => {

    const result =

        getDashboardData();

    res.json(result);
});


module.exports = router;
