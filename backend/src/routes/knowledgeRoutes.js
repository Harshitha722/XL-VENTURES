const express = require("express");
const PLAYBOOK_CORPUS = require("../knowledge/playbookCorpus");

const router = express.Router();

router.get("/playbooks", (req, res) => {
    res.json(PLAYBOOK_CORPUS);
});

module.exports = router;
