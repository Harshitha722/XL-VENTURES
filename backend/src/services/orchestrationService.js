const fs = require("fs");
const path = require("path");

const plannerAgent =
    require("../agents/planner/plannerAgent");

const AgentRegistry =
    require("../agents/shared/agentRegistry");

const businessReasoningAgent =
    require("../agents/reasoning/businessReasoningAgent");

const recommendationAgent =
    require("../agents/recommendation/recommendationAgent");

const explanationAgent =
    require("../agents/explanation/explanationAgent");

const LATEST_ANALYSIS_PATH = path.join(
    __dirname,
    "../data/latestAnalysis.json"
);

/**
 * Collect readable evidence lines from the uploaded documents.
 * ExplanationAgent uses these snippets so the final output can point back to
 * the real source content instead of mock data.
 */
function buildEvidence(uploadedText) {
    const combinedText = [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText
    ].join("\n");

    const keywords = [
        "adoption",
        "renew",
        "contract",
        "discount",
        "sla",
        "frustrated",
        "unhappy",
        "support",
        "escalation",
        "executive",
        "analytics",
        "auto renewal"
    ];

    return combinedText
        .split(/(?<=[.!?])\s+|\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => {
            const lowerLine = line.toLowerCase();
            return keywords.some((keyword) => lowerLine.includes(keyword));
        })
        .slice(0, 10);
}

/**
 * Persist the latest analysis in single-user hackathon mode.
 * Every dashboard-style frontend page reads from this file.
 */
function saveLatestAnalysis(result) {
    fs.writeFileSync(
        LATEST_ANALYSIS_PATH,
        JSON.stringify(result, null, 4)
    );
}

/**
 * Run the full RenewAI agent pipeline from uploaded document text.
 */
function orchestrate(uploadedText) {
    const evidence = buildEvidence(uploadedText);

    const orchestrationInput = {
        contractText: uploadedText.contractText || "",
        meetingText: uploadedText.meetingText || "",
        emailText: uploadedText.emailText || "",
        evidence
    };

    const executionPlan =
        plannerAgent(orchestrationInput);

    const agentOutputs = {};

    executionPlan.forEach((agentName) => {
        const agent =
            AgentRegistry[agentName];

        if (!agent) {
            return;
        }

        agentOutputs[agentName] =
            agent(orchestrationInput);
    });

    const reasoning =
        businessReasoningAgent(agentOutputs);

    const recommendations =
        recommendationAgent(reasoning);

    const explanations =
        explanationAgent(
            recommendations,
            agentOutputs,
            reasoning,
            orchestrationInput
        );

    const result = {
        timestamp: new Date().toISOString(),
        executionPlan,
        agentOutputs,
        reasoning,
        recommendations,
        explanations
    };

    saveLatestAnalysis(result);

    return result;
}

module.exports = orchestrate;
