const express = require("express");
const devilsAdvocateAgent = require("../agents/critique/devilsAdvocateAgent");

const router = express.Router();

/**
 * POST /api/devils-advocate
 * Run the Devil's Advocate Agent against the selected scenario.
 */
router.post("/", async (req, res) => {
    try {
        const { bestScenario, reasoning, agentOutputs } = req.body;

        const result = await devilsAdvocateAgent({
            bestScenario,
            reasoning,
            agentOutputs
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to run Devil's Advocate review." });
    }
});

module.exports = router;
