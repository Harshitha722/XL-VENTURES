const express = require("express");

const {
    getRenewalTimeline
} = require("../services/timelineService");

const router = express.Router();


router.get("/:customerId", (req, res) => {

    res.json(

        getRenewalTimeline(
            req.params.customerId
        )
    );
});


module.exports = router;