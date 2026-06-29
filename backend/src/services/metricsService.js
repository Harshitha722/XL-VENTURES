const { getMemory } = require("../memory/memoryAgent");
const BUSINESS_RULES = require("../config/businessRules");
const { discoverPatterns } = require("./patternAgent");

function computeMetrics(context = {}) {
    const memory = getMemory().filter((entry) =>
        (!context.tenantId || entry.tenantId === context.tenantId || !entry.tenantId) &&
        (!context.workspaceId || entry.workspaceId === context.workspaceId || !entry.workspaceId)
    );

    const totalAnalyses = memory.filter((entry) => entry.type === "analysis").length;
    const reviewActions = memory.flatMap((entry) => entry.reviewHistory || []);
    const totalApprovals = reviewActions.filter((entry) => entry.action === "approve").length;
    const totalRejections = reviewActions.filter((entry) => entry.action === "reject").length;
    const reviewerStats = {};

    reviewActions.forEach((review) => {
        const reviewer = review.reviewerId || "system";
        reviewerStats[reviewer] = reviewerStats[reviewer] || {
            reviewed: 0,
            approved: 0,
            rejected: 0,
            escalated: 0
        };
        reviewerStats[reviewer].reviewed += 1;
        if (review.action === "approve") reviewerStats[reviewer].approved += 1;
        if (review.action === "reject") reviewerStats[reviewer].rejected += 1;
        if (review.action === "escalate") reviewerStats[reviewer].escalated += 1;
    });

    const acceptanceRate = totalApprovals + totalRejections > 0
        ? Math.round((totalApprovals / (totalApprovals + totalRejections)) * 100)
        : null;

    const allApprovedRecs = memory
        .filter((entry) => entry.approvedRecommendations?.length)
        .flatMap((entry) => entry.approvedRecommendations || []);

    const avgConfidence = allApprovedRecs.length
        ? Math.round(allApprovedRecs.reduce((sum, item) => sum + (item.confidence || 0), 0) / allApprovedRecs.length)
        : null;

    const actionBreakdown = {};
    allApprovedRecs.forEach((item) => {
        actionBreakdown[item.recommendation] = (actionBreakdown[item.recommendation] || 0) + 1;
    });

    return {
        platform: {
            totalAnalysesRun: totalAnalyses,
            totalRecommendationsApproved: totalApprovals,
            totalRecommendationsRejected: totalRejections,
            memoryGrowth: memory.length,
            recommendationAcceptanceRate: acceptanceRate ? `${acceptanceRate}%` : "N/A (no reviews yet)",
            averageConfidenceOfApprovedActions: avgConfidence ? `${avgConfidence}%` : "N/A",
            mostFrequentApprovedAction: Object.keys(actionBreakdown).sort((a, b) => actionBreakdown[b] - actionBreakdown[a])[0] || "N/A"
        },
        reviewerPerformance: reviewerStats,
        discoveredPatterns: discoverPatterns(memory).patterns,
        businessTargets: {
            targetChurnReduction: `${BUSINESS_RULES.successMetrics.targetChurnReduction}% reduction in churn probability`,
            targetAdoptionIncrease: `${BUSINESS_RULES.successMetrics.targetAdoptionIncrease}% increase in adoption after workshops`,
            renewalConfirmationTarget: `Renewal confirmed within ${BUSINESS_RULES.successMetrics.renewalConfirmationDays} days`,
            npsImprovementTarget: `+${BUSINESS_RULES.successMetrics.npsImprovementTarget} NPS points after EBR`
        },
        actionBreakdown
    };
}

module.exports = { computeMetrics };
