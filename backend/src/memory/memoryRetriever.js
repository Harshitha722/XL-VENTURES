const { getMemory } = require("./memoryAgent");

function getRecommendationMemoryContext(limit = 5) {
    const approved = getMemory()
        .flatMap((entry) => entry.approvedRecommendations || [])
        .filter((item) => item.recommendation)
        .slice(-limit)
        .reverse();

    if (!approved.length) {
        return "No approved recommendation history yet.";
    }

    return approved
        .map((item) => `Approved: ${item.recommendation} (${item.priority || "MEDIUM"}, confidence ${item.confidence || "N/A"}%)`)
        .join("\n");
}

module.exports = {
    getRecommendationMemoryContext
};
