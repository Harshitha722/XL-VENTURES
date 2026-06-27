const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();

const LATEST_ANALYSIS_PATH = path.join(
    __dirname,
    "../data/latestAnalysis.json"
);

/**
 * GET /api/latest-analysis
 *
 * Returns the most recent upload-driven analysis.
 */
router.get("/", (req, res) => {
    const raw = fs.readFileSync(
        LATEST_ANALYSIS_PATH,
        "utf8"
    );

    res.json(JSON.parse(raw || "{}"));
});

module.exports = router;
