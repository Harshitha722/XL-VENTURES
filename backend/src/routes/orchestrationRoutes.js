const express = require("express");

const orchestrate =
    require("../services/orchestrationService");

const router = express.Router();

/**
 * Compatibility route.
 * Milestone 1 uses POST /api/upload/analyze, but this keeps older local tests
 * from breaking while still using the new document-driven orchestrator.
 */
router.post("/", (req, res) => {
    try {
        const result =
            orchestrate({
                contractText: req.body.contractText || "",
                meetingText: req.body.meetingText || req.body.interaction || "",
                emailText: req.body.emailText || ""
            });

        res.json(result);
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = router;
