const { getMemory } = require("../memory/memoryAgent");
const BUSINESS_RULES = require("../config/businessRules");

function computeMetrics() {
    const memory = getMemory();

    const totalAnalyses = memory.filter((entry) => entry.type === "analysis").length;
    const totalApprovals = memory.filter((entry) => entry.humanFeedback === "approved").length;
    const totalRejections = memory.filter((entry) => entry.humanFeedback === "rejected").length;

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
            recommendationAcceptanceRate: acceptanceRate ? `${acceptanceRate}%` : "N/A (no reviews yet)",
            averageConfidenceOfApprovedActions: avgConfidence ? `${avgConfidence}%` : "N/A",
            mostFrequentApprovedAction: Object.keys(actionBreakdown).sort((a, b) => actionBreakdown[b] - actionBreakdown[a])[0] || "N/A"
        },
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
