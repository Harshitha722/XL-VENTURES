function clampScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function calculateAcceptanceRate(memory, action) {
    const reviewed = memory
        .flatMap((entry) => entry.reviewHistory || [])
        .filter((review) => !action || review.recommendation === action);

    if (!reviewed.length) {
        return 50;
    }

    const accepted = reviewed.filter((review) =>
        ["approve", "override", "delegate"].includes(review.action)
    ).length;

    return Math.round((accepted / reviewed.length) * 100);
}

function scoreRecommendation({ recommendation, evidence = [], signals = [], memory = [] }) {
    const memoryScore = memory.length ? Math.min(100, 55 + memory.length * 8) : 45;
    const evidenceScore = evidence.length ? Math.min(100, 52 + evidence.length * 9) : 35;
    const signalScore = signals.length ? Math.min(100, 50 + signals.length * 10) : 45;
    const acceptanceRate = calculateAcceptanceRate(memory, recommendation?.action || recommendation);

    const confidence = clampScore(
        (0.35 * memoryScore) +
        (0.25 * evidenceScore) +
        (0.20 * signalScore) +
        (0.20 * acceptanceRate)
    );

    return {
        confidence,
        components: {
            memory: memoryScore,
            evidence: evidenceScore,
            signals: signalScore,
            acceptance_rate: acceptanceRate
        }
    };
}

module.exports = {
    scoreRecommendation
};
