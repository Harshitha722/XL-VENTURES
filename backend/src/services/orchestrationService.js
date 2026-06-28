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

const dataCompletenessAgent =
    require("../agents/dataCompleteness/dataCompletenessAgent");


const LATEST_ANALYSIS_PATH = path.join(
    __dirname,
    "../data/latestAnalysis.json"
);


/**
 * Collect readable evidence lines from the uploaded documents.
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

            const lowerLine =
                line.toLowerCase();

            return keywords.some((keyword) =>
                lowerLine.includes(keyword)
            );
        })
        .slice(0, 10);
}


/**
 * Save latest analysis.
 */
function saveLatestAnalysis(result) {

    fs.writeFileSync(
        LATEST_ANALYSIS_PATH,
        JSON.stringify(result, null, 4)
    );
}


/**
 * Main orchestration pipeline.
 */
function orchestrate(uploadedText) {

    const evidence =
        buildEvidence(uploadedText);

    const orchestrationInput = {

        contractText:
            uploadedText.contractText || "",

        meetingText:
            uploadedText.meetingText || "",

        emailText:
            uploadedText.emailText || "",

        evidence
    };


    /**
     * Planner decides which agents to run.
     */
    const executionPlan =
        plannerAgent(orchestrationInput);


    const agentOutputs = {};


    /**
     * Run selected domain agents.
     */
    executionPlan.forEach((agentName) => {

        const agent =
            AgentRegistry[agentName];

        if (!agent) {
            return;
        }

        agentOutputs[agentName] =
            agent(orchestrationInput);
    });


    /**
     * Run Data Completeness Agent
     * AFTER all business agents.
     */
    agentOutputs.DataCompletenessAgent =
        dataCompletenessAgent(
            agentOutputs
        );


    /**
     * Business reasoning layer.
     */
    const reasoning =
        businessReasoningAgent(
            agentOutputs
        );


    /**
     * Generate recommendations.
     */
    const recommendations =
        recommendationAgent(
            reasoning
        );


    /**
     * Explain recommendations.
     */
    const explanations =
        explanationAgent(
            recommendations,
            agentOutputs,
            reasoning,
            orchestrationInput
        );


    const result = {

        timestamp:
            new Date().toISOString(),

        executionPlan: [
            ...executionPlan,
            "DataCompletenessAgent"
        ],

        agentOutputs,

        reasoning,

        recommendations,

        explanations
    };


    saveLatestAnalysis(result);

    return result;
}


module.exports =
    orchestrate;