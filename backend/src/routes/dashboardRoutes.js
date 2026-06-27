/**
 * DASHBOARD ROUTES
 */

const express = require("express");

const {
    getDashboardData
} = require("../services/dashboardService");

const router = express.Router();


/**
 * GET /api/dashboard/:customerId
 */
router.get("/:customerId", (req, res) => {

    const result =

        getDashboardData(
            req.params.customerId
        );

    res.json(result);
});


module.exports = router;