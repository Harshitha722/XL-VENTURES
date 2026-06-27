const express = require("express");

const {
    getRenewalTimeline
} = require("../services/timelineService");

const router = express.Router();


router.get("/", (req, res) => {

    res.json(

        getRenewalTimeline()
    );
});


module.exports = router;
