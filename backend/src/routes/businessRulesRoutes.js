const express = require("express");
const BUSINESS_RULES = require("../config/businessRules");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(BUSINESS_RULES);
});

module.exports = router;
