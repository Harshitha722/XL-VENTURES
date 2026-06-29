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
const fsp = require("fs/promises");
const path = require("path");

const MEMORY_PATH = path.join(
    __dirname,
    "memoryStore.json"
);

const CACHE_TTL_MS = Number(process.env.MEMORY_CACHE_TTL_MS || 300000);
const CACHE_MAX_ENTRIES = Number(process.env.MEMORY_CACHE_MAX_ENTRIES || 250);
let cachedMemory = null;
let cacheLoadedAt = 0;
let customerIndex = new Map();

function normalizeTenant(entry) {
    return {
        tenantId: entry.tenantId || "default-tenant",
        workspaceId: entry.workspaceId || "default-workspace"
    };
}

function rebuildIndexes(memory) {
    customerIndex = new Map();

    memory.forEach((entry, index) => {
        const customerId =
            entry.customerId ||
            entry.agentOutputs?.CRMContextAgent?.customerId ||
            entry.agentOutputs?.CRMContextAgent?.accountId;

        if (!customerId) {
            return;
        }

        if (!customerIndex.has(customerId)) {
            customerIndex.set(customerId, []);
        }

        customerIndex.get(customerId).push(index);
    });
}

function trimMemory(memory) {
    return memory.length > CACHE_MAX_ENTRIES
        ? memory.slice(memory.length - CACHE_MAX_ENTRIES)
        : memory;
}


/**
 * Load memory entries.
 */
function getMemory() {

    const now = Date.now();

    if (cachedMemory && now - cacheLoadedAt < CACHE_TTL_MS) {
        return cachedMemory;
    }

    const data = fs.readFileSync(MEMORY_PATH, "utf-8");

    cachedMemory = JSON.parse(data.replace(/^\uFEFF/, ""));
    cacheLoadedAt = now;
    rebuildIndexes(cachedMemory);

    return cachedMemory;
}

async function getMemoryAsync() {
    const now = Date.now();

    if (cachedMemory && now - cacheLoadedAt < CACHE_TTL_MS) {
        return cachedMemory;
    }

    const data = await fsp.readFile(MEMORY_PATH, "utf-8");
    cachedMemory = JSON.parse(data.replace(/^\uFEFF/, ""));
    cacheLoadedAt = now;
    rebuildIndexes(cachedMemory);

    return cachedMemory;
}


function writeMemory(memory) {
    cachedMemory = trimMemory(memory);
    cacheLoadedAt = Date.now();
    rebuildIndexes(cachedMemory);

    fs.writeFileSync(

        MEMORY_PATH,

        JSON.stringify(
            memory,
            null,
            4
        )
    );
}

async function writeMemoryAsync(memory) {
    cachedMemory = trimMemory(memory);
    cacheLoadedAt = Date.now();
    rebuildIndexes(cachedMemory);

    await fsp.writeFile(
        MEMORY_PATH,
        JSON.stringify(cachedMemory, null, 4)
    );
}


/**
 * Add a new memory entry.
 */
function saveMemory(entry) {

    const memory = getMemory();

    memory.push({

        ...entry,
        ...normalizeTenant(entry),

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

async function addReviewAction({
    index,
    recommendation,
    action,
    comment,
    delegateTo,
    overrideRecommendation,
    tenantId = "default-tenant",
    workspaceId = "default-workspace",
    reviewerId = "system",
    reviewerRole = "admin"
}) {
    const allowedActions = [
        "approve",
        "reject",
        "escalate",
        "delegate",
        "request_information",
        "override",
        "archive"
    ];

    if (!allowedActions.includes(action)) {
        const error = new Error("Unsupported review action.");
        error.statusCode = 400;
        throw error;
    }

    const memory = await getMemoryAsync();
    const entry = memory[index];

    if (!entry) {
        const error = new Error("Memory entry not found.");
        error.statusCode = 404;
        throw error;
    }

    const reviewedAt = new Date().toISOString();
    const review = {
        action,
        recommendation,
        comment: comment || "",
        delegateTo: delegateTo || null,
        overrideRecommendation: overrideRecommendation || null,
        tenantId,
        workspaceId,
        reviewerId,
        reviewerRole,
        reviewedAt
    };

    entry.reviewHistory = Object.freeze([
        ...(entry.reviewHistory || []),
        review
    ]);
    entry.humanFeedback = action;
    entry.reviewedAt = reviewedAt;
    entry.tenantId = entry.tenantId || tenantId;
    entry.workspaceId = entry.workspaceId || workspaceId;

    if (action === "approve") {
        const approvals = entry.approvedRecommendations || [];
        const approval = {
            recommendation,
            status: "approved",
            approvedAt: reviewedAt,
            confidence: entry.finalRecommendation?.confidence || null
        };

        if (!approvals.some((item) => item.recommendation === recommendation)) {
            approvals.push(approval);
        }

        entry.approvedRecommendations = approvals;
    }

    await writeMemoryAsync(memory);

    return review;
}

function searchMemory({ tenantId, workspaceId, customerId, query, type }) {
    const memory = getMemory();
    const indexes = customerId && customerIndex.has(customerId)
        ? customerIndex.get(customerId)
        : memory.map((_, index) => index);
    const lowerQuery = String(query || "").toLowerCase();

    return indexes
        .map((index) => ({ ...memory[index], index }))
        .filter((entry) =>
            (!tenantId || entry.tenantId === tenantId || !entry.tenantId) &&
            (!workspaceId || entry.workspaceId === workspaceId || !entry.workspaceId) &&
            (!type || entry.type === type) &&
            (!lowerQuery || JSON.stringify(entry).toLowerCase().includes(lowerQuery))
        );
}


function addRecommendationApproval({
    analysisTimestamp,
    recommendation,
    priority,
    reason,
    confidence,
    evidence = [],
    tenantId = "default-tenant",
    workspaceId = "default-workspace"
}) {

    const memory = getMemory();

    const approvedAt = new Date().toISOString();

    const approval = {
        recommendation,
        priority,
        reason,
        confidence,
        evidence,
        tenantId,
        workspaceId,
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
        matchingEntry.tenantId = matchingEntry.tenantId || tenantId;
        matchingEntry.workspaceId = matchingEntry.workspaceId || workspaceId;
        matchingEntry.reviewHistory = [
            ...(matchingEntry.reviewHistory || []),
            {
                action: "approve",
                recommendation,
                tenantId,
                workspaceId,
                reviewerId: "system",
                reviewerRole: "admin",
                comment: "Approved from recommendation page.",
                reviewedAt: approvedAt
            }
        ];

        writeMemory(memory);

        return matchingEntry;
    }

    const approvalEntry = {
        type: "recommendationApproval",
        source: "latestAnalysis",
        tenantId,
        workspaceId,
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
    getMemoryAsync,

    saveMemory,

    addHumanFeedback,

    addRecommendationApproval,

    addReviewAction,

    searchMemory
};

