const express = require("express");
const { readAuditLog } = require("../services/auditService");
const { asyncHandler } = require("../middleware/errorMiddleware");
const { requirePermission } = require("../middleware/contextMiddleware");

const router = express.Router();

router.get(
    "/",
    requirePermission("audit:read"),
    asyncHandler(async (req, res) => {
        const entries = await readAuditLog({
            tenantId: req.query.tenantId || req.context.tenantId,
            workspaceId: req.query.workspaceId || req.context.workspaceId,
            entityType: req.query.entityType,
            action: req.query.action
        });

        res.json({
            success: true,
            entries
        });
    })
);

module.exports = router;
