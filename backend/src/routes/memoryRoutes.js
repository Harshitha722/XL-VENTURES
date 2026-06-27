/**
 * MEMORY ROUTES
 */

const express = require("express");

const {

    getMemory,

    addHumanFeedback

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


module.exports = router;