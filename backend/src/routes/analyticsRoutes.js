const express = require("express");
const { computeMetrics } = require("../services/metricsService");
const { requirePermission } = require("../middleware/contextMiddleware");

const router = express.Router();

router.get("/", requirePermission("analytics:read"), (req, res) => {
    res.json(computeMetrics(req.context));
});

module.exports = router;
