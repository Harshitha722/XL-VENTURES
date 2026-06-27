const express = require("express");

const {
    getRiskScore
} = require("../services/riskService");

const router = express.Router();


router.get("/", (req, res) => {

    res.json(

        getRiskScore()
    );
});


module.exports = router;
