const express = require("express");
const scenarioSimulationAgent = require("../agents/simulation/scenarioSimulationAgent");

const router = express.Router();

/**
 * POST /api/scenario-analysis
 * Run the Scenario Simulation Agent with provided analysis inputs.
 */
router.post("/", async (req, res) => {
    try {
        const { agentOutputs, reasoning, orchestrationInput } = req.body;

        const result = await scenarioSimulationAgent({
            agentOutputs,
            reasoning,
            orchestrationInput
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to run scenario simulation." });
    }
});

module.exports = router;
