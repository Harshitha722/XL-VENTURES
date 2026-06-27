/**
 * ORCHESTRATION SERVICE
 *
 * Purpose:
 * Execute the complete agent workflow:
 *
 * Interaction
 *      ↓
 * Planner Agent
 *      ↓
 * Agent Registry
 *      ↓
 * Execute Selected Agents
 *      ↓
 * Business Reasoning Agent
 *      ↓
 * Final Insights
 */

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


function orchestrate(customerId, interaction) {

    /**
     * Step 1:
     * Generate execution plan.
     */
    const executionPlan =
        plannerAgent(interaction);

    /**
     * Store outputs from all agents.
     */
    const agentOutputs = {};

    /**
     * Step 2:
     * Execute each selected agent.
     */
    executionPlan.forEach((agentName) => {

        const agent =
            AgentRegistry[agentName];

        /**
         * Skip if agent does not exist.
         */
        if (!agent) {
            return;
        }

        /**
         * Knowledge Agent expects
         * a problem type instead of
         * a customer ID.
         */
        if (agentName === "KnowledgeAgent") {

            agentOutputs[agentName] =
                agent("low_adoption");
        }

        /**
         * All other agents use
         * customer ID.
         */
        else {

            agentOutputs[agentName] =
                agent(customerId);
        }
    });

    /**
     * Step 3:
     * Generate business insights.
     */
    const reasoning =

        businessReasoningAgent(
            agentOutputs
        );

    /**
     * Final response.
     */
  /**
 * Generate recommendations.
 */
const recommendations =

    recommendationAgent(
        reasoning
    );

/**
 * Generate explainable outputs.
 */
const explanations =

    explanationAgent(
        recommendations,
        agentOutputs,
        reasoning
    );


return {

    executionPlan,

    agentOutputs,

    reasoning,

    recommendations,

    explanations
};
}


module.exports = orchestrate;