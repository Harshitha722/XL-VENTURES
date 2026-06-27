/**
 * ORCHESTRATION ROUTES
 *
 * Purpose:
 * Expose the complete RenewAI
 * orchestration pipeline as an API.
 */

const express = require("express");

const orchestrate =
    require("../services/orchestrationService");

const router = express.Router();


/**
 * POST /api/orchestrate
 *
 * Body:
 * {
 *    customerId: 1,
 *    interaction: "..."
 * }
 */
router.post("/", (req, res) => {

    try {

        const {

            customerId,

            interaction

        } = req.body;


        /**
         * Validate request.
         */
        if (!customerId || !interaction) {

            return res.status(400).json({

                error:
                    "customerId and interaction are required"
            });
        }


        /**
         * Execute orchestration pipeline.
         */
        const result =

            orchestrate(
                customerId,
                interaction
            );


        res.json(result);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Internal Server Error"
        });
    }

});


module.exports = router;