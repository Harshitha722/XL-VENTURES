const fs = require("fs");
const path = require("path");

const plannerAgent =
    require("../agents/planner/plannerAgent");

const domainDetectionAgent =
    require("../agents/domain/domainDetectionAgent");

const AgentRegistry =
    require("../agents/shared/agentRegistry");

const businessReasoningAgent =
    require("../agents/reasoning/businessReasoningAgent");

const scenarioSimulationAgent =
    require("../agents/simulation/scenarioSimulationAgent");

const devilsAdvocateAgent =
    require("../agents/critique/devilsAdvocateAgent");

const recommendationAgent =
    require("../agents/recommendation/recommendationAgent");

const explanationAgent =
    require("../agents/explanation/explanationAgent");

const dataCompletenessAgent =
    require("../agents/dataCompleteness/dataCompletenessAgent");

const {
    saveMemory
} = require("../memory/memoryAgent");


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
async function orchestrate(uploadedText) {

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
    const domainDetection =
        await domainDetectionAgent(orchestrationInput);


    const plannerResult =
        await plannerAgent(orchestrationInput);

    const executionPlan =
        plannerResult.agents;

    const executionPlanReasoning =
        plannerResult.reasoning;


    const agentOutputs = {};


    /**
     * Run selected domain agents.
     */
    for (const agentName of executionPlan) {

        const agent =
            AgentRegistry[agentName];

        if (!agent) {
            continue;
        }

        agentOutputs[agentName] =
            await agent(orchestrationInput);
    }


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
        await businessReasoningAgent(
            agentOutputs
        );


    /**
     * Scenario simulation layer.
     */
    const scenarioAnalysis =
        await scenarioSimulationAgent({
            agentOutputs,
            reasoning,
            orchestrationInput
        });


    /**
     * Devil's Advocate critique.
     */
    const devilsAdvocateReview =
        await devilsAdvocateAgent({
            bestScenario: scenarioAnalysis.bestScenario,
            reasoning,
            agentOutputs
        });


    /**
     * Generate recommendations.
     */
    const recommendationResult =
        await recommendationAgent(
            reasoning,
            scenarioAnalysis,
            devilsAdvocateReview
        );

    const recommendations =
        Array.isArray(recommendationResult.recommendations)
            ? recommendationResult.recommendations
            : recommendationResult;

    const finalRecommendation =
        recommendationResult.finalRecommendation ||
        recommendations[0] ||
        null;


    /**
     * Explain recommendations.
     */
    const explanations =
        await explanationAgent(
            recommendations,
            agentOutputs,
            reasoning,
            orchestrationInput
        );


    const result = {

        timestamp:
            new Date().toISOString(),

        domainDetection,

        executionPlan: [
            ...executionPlan,
            "DataCompletenessAgent",
            "ScenarioSimulationAgent",
            "DevilsAdvocateAgent"
        ],

        executionPlanReasoning,

        agentOutputs,

        reasoning,

        scenarioAnalysis,

        devilsAdvocateReview,

        finalRecommendation,

        recommendations,

        explanations
    };


    saveLatestAnalysis(result);

    saveMemory({
        type: "analysis",
        domainDetection,
        executionPlan: result.executionPlan,
        reasoning,
        scenarioAnalysis,
        devilsAdvocateReview,
        finalRecommendation,
        recommendations,
        explanations
    });

    return result;
}


module.exports =
    orchestrate;
