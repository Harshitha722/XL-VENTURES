const express = require("express");
const { getCRMProvider } = require("../crm");
const { asyncHandler } = require("../middleware/errorMiddleware");
const { requirePermission } = require("../middleware/contextMiddleware");

const router = express.Router();

router.get(
    "/customer/:id",
    requirePermission("crm:read"),
    asyncHandler(async (req, res) => {
        const provider = getCRMProvider();
        res.json(await provider.getCustomer(req.params.id, req.context));
    })
);

router.get(
    "/opportunities/:id",
    requirePermission("crm:read"),
    asyncHandler(async (req, res) => {
        const provider = getCRMProvider();
        res.json(await provider.getOpportunities(req.params.id, req.context));
    })
);

router.get(
    "/activities/:id",
    requirePermission("crm:read"),
    asyncHandler(async (req, res) => {
        const provider = getCRMProvider();
        res.json(await provider.getActivities(req.params.id, req.context));
    })
);

module.exports = router;
