/**
 * MEMORY AGENT
 *
 * Purpose:
 * Store previous interactions,
 * recommendations,
 * explanations,
 * approvals,
 * and human feedback.
 */

const fs = require("fs");
const path = require("path");

const MEMORY_PATH = path.join(
    __dirname,
    "memoryStore.json"
);


/**
 * Load memory entries.
 */
function getMemory() {

    const data =
        fs.readFileSync(
            MEMORY_PATH,
            "utf-8"
        );

    return JSON.parse(data.replace(/^\uFEFF/, ""));
}


function writeMemory(memory) {

    fs.writeFileSync(

        MEMORY_PATH,

        JSON.stringify(
            memory,
            null,
            4
        )
    );
}


/**
 * Add a new memory entry.
 */
function saveMemory(entry) {

    const memory = getMemory();

    memory.push({

        ...entry,

        timestamp:
            new Date().toISOString()
    });

    writeMemory(memory);
}


/**
 * Human feedback.
 */
function addHumanFeedback(
    index,
    feedback,
    comment
) {

    const memory = getMemory();

    if (!memory[index]) {

        return false;
    }

    memory[index].humanFeedback = feedback;

    memory[index].comment = comment;

    memory[index].reviewedAt =
        new Date().toISOString();

    writeMemory(memory);

    return true;
}


function addRecommendationApproval({
    analysisTimestamp,
    recommendation,
    priority,
    reason,
    confidence,
    evidence = []
}) {

    const memory = getMemory();

    const approvedAt = new Date().toISOString();

    const approval = {
        recommendation,
        priority,
        reason,
        confidence,
        evidence,
        status: "approved",
        approvedAt
    };

    const matchingEntry = memory.find(
        entry => entry.timestamp === analysisTimestamp
    );

    if (matchingEntry) {

        const approvals =
            matchingEntry.approvedRecommendations || [];

        const alreadyApproved = approvals.some(
            item => item.recommendation === recommendation
        );

        if (!alreadyApproved) {
            approvals.push(approval);
        }

        matchingEntry.approvedRecommendations = approvals;
        matchingEntry.humanFeedback = "approved";
        matchingEntry.reviewedAt = approvedAt;

        writeMemory(memory);

        return matchingEntry;
    }

    const approvalEntry = {
        type: "recommendationApproval",
        source: "latestAnalysis",
        analysisTimestamp,
        humanFeedback: "approved",
        approvedRecommendations: [approval],
        reviewedAt: approvedAt,
        timestamp: approvedAt
    };

    memory.push(approvalEntry);

    writeMemory(memory);

    return approvalEntry;
}


module.exports = {

    getMemory,

    saveMemory,

    addHumanFeedback,

    addRecommendationApproval
};

