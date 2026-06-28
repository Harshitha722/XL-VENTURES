/**
 * MEMORY ROUTES
 */

const express = require("express");

const {

    getMemory,

    addHumanFeedback,

    addRecommendationApproval

} = require("../memory/memoryAgent");

const router = express.Router();


/**
 * GET all memory entries.
 */
router.get("/", (req, res) => {

    res.json(
        getMemory()
    );
});


/**
 * Human review endpoint.
 */
router.post("/review", (req, res) => {

    const {

        index,

        feedback,

        comment

    } = req.body;


    const success =

        addHumanFeedback(

            index,

            feedback,

            comment
        );


    if (!success) {

        return res.status(404).json({

            error:
                "Memory entry not found"
        });
    }


    res.json({

        message:
            "Feedback saved successfully"
    });
});


/**
 * Recommendation approval endpoint.
 */
router.post("/approve-recommendation", (req, res) => {

    const {
        analysisTimestamp,
        recommendation
    } = req.body;

    if (!analysisTimestamp || !recommendation) {

        return res.status(400).json({
            error:
                "analysisTimestamp and recommendation are required."
        });
    }

    const memoryEntry = addRecommendationApproval(req.body);

    res.json({
        message: "Recommendation approved and saved to memory.",
        memoryEntry
    });
});


module.exports = router;
