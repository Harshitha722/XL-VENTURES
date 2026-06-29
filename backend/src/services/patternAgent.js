function discoverPatterns(memory) {
    const actionStats = new Map();
    const rejectionMemory = [];

    memory.forEach((entry) => {
        (entry.reviewHistory || []).forEach((review) => {
            const key = review.recommendation || "Unknown recommendation";
            const stats = actionStats.get(key) || {
                recommendation: key,
                approvals: 0,
                rejections: 0,
                escalations: 0,
                overrides: 0
            };

            if (review.action === "approve") stats.approvals += 1;
            if (review.action === "reject") stats.rejections += 1;
            if (review.action === "escalate") stats.escalations += 1;
            if (review.action === "override") stats.overrides += 1;

            actionStats.set(key, stats);

            if (review.action === "reject") {
                rejectionMemory.push({
                    recommendation: key,
                    reason: review.comment || "Rejected by reviewer",
                    tenantId: review.tenantId,
                    workspaceId: review.workspaceId,
                    reviewedAt: review.reviewedAt
                });
            }
        });
    });

    return {
        patterns: Array.from(actionStats.values()).map((stats) => ({
            ...stats,
            acceptanceRate: stats.approvals + stats.rejections > 0
                ? Math.round((stats.approvals / (stats.approvals + stats.rejections)) * 100)
                : null
        })),
        rejectionMemory
    };
}

module.exports = {
    discoverPatterns
};
