const express = require("express");

const {
    getArchitecture
} = require("../services/architectureService");

const router = express.Router();


router.get("/", (req, res) => {

    res.json(
        getArchitecture()
    );
});


module.exports = router;