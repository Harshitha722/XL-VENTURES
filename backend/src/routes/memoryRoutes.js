/**
 * MEMORY ROUTES
 */

const express = require("express");

const {

    getMemory,

    addHumanFeedback,

    addRecommendationApproval,

    addReviewAction,

    searchMemory

} = require("../memory/memoryAgent");
const { appendAuditEvent } = require("../services/auditService");
const { discoverPatterns } = require("../services/patternAgent");
const { asyncHandler } = require("../middleware/errorMiddleware");
const { requirePermission } = require("../middleware/contextMiddleware");

const router = express.Router();


/**
 * GET all memory entries.
 */
router.get("/", requirePermission("memory:read"), (req, res) => {

    res.json(
        searchMemory({
            tenantId: req.query.tenantId || req.context.tenantId,
            workspaceId: req.query.workspaceId || req.context.workspaceId,
            customerId: req.query.customerId,
            query: req.query.query,
            type: req.query.type
        })
    );
});

router.get("/patterns", requirePermission("memory:read"), (req, res) => {
    res.json(discoverPatterns(getMemory()));
});


/**
 * Human review endpoint.
 */
router.post("/review", (req, res) => {

    const {

        index,

        feedback,

        comment

    } = req.body;


    const success =

        addHumanFeedback(

            index,

            feedback,

            comment
        );


    if (!success) {

        return res.status(404).json({

            error:
                "Memory entry not found"
        });
    }


    res.json({

        message:
            "Feedback saved successfully"
    });
});

router.post(
    "/review-action",
    requirePermission("recommendation:review"),
    asyncHandler(async (req, res) => {
        const review = await addReviewAction({
            ...req.body,
            tenantId: req.context.tenantId,
            workspaceId: req.context.workspaceId,
            reviewerId: req.context.userId,
            reviewerRole: req.context.role
        });

        await appendAuditEvent({
            tenantId: req.context.tenantId,
            workspaceId: req.context.workspaceId,
            actorId: req.context.userId,
            action: `review.${review.action}`,
            entityType: "recommendation",
            entityId: review.recommendation,
            details: review
        });

        res.json({
            message: "Review action saved.",
            review
        });
    })
);


/**
 * Recommendation approval endpoint.
 */
router.post("/approve-recommendation", asyncHandler(async (req, res) => {

    const {
        analysisTimestamp,
        recommendation
    } = req.body;

    if (!analysisTimestamp || !recommendation) {

        return res.status(400).json({
            error:
                "analysisTimestamp and recommendation are required."
        });
    }

    const memoryEntry = addRecommendationApproval({
        ...req.body,
        tenantId: req.context.tenantId,
        workspaceId: req.context.workspaceId
    });

    await appendAuditEvent({
        tenantId: req.context.tenantId,
        workspaceId: req.context.workspaceId,
        actorId: req.context.userId,
        action: "recommendation.approve",
        entityType: "recommendation",
        entityId: recommendation,
        details: req.body
    });

    res.json({
        message: "Recommendation approved and saved to memory.",
        memoryEntry
    });
}));


module.exports = router;
