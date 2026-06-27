const express = require("express");

const {
    getRiskScore
} = require("../services/riskService");

const router = express.Router();


router.get("/:customerId", (req, res) => {

    res.json(

        getRiskScore(
            req.params.customerId
        )
    );
});


module.exports = router;