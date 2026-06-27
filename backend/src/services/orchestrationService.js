/**
 * ORCHESTRATION SERVICE
 *
 * Complete RenewAI execution pipeline:
 *
 * Interaction
 *      ↓
 * Planner Agent
 *      ↓
 * Agent Registry
 *      ↓
 * Domain Agents
 *      ↓
 * Business Reasoning Agent
 *      ↓
 * Recommendation Agent
 *      ↓
 * Explanation Agent
 *      ↓
 * Shared Memory
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

const {
    saveMemory
} = require("../memory/memoryAgent");


function orchestrate(customerId, interaction) {

    /**
     * STEP 1:
     * Create execution plan.
     */
    const executionPlan =
        plannerAgent(interaction);


    /**
     * STEP 2:
     * Execute selected agents.
     */
    const agentOutputs = {};

    executionPlan.forEach((agentName) => {

        const agent =
            AgentRegistry[agentName];

        if (!agent) {
            return;
        }


        /**
         * Knowledge Agent expects
         * a problem type instead
         * of a customer ID.
         */
        if (agentName === "KnowledgeAgent") {

            agentOutputs[agentName] =
                agent("low_adoption");
        }

        else {

            agentOutputs[agentName] =
                agent(customerId);
        }

    });


    /**
     * STEP 3:
     * Generate business insights.
     */
    const reasoning =

        businessReasoningAgent(
            agentOutputs
        );


    /**
     * STEP 4:
     * Generate recommendations.
     */
    const recommendations =

        recommendationAgent(
            reasoning
        );


    /**
     * STEP 5:
     * Generate explanations.
     */
    const explanations =

        explanationAgent(

            recommendations,

            agentOutputs,

            reasoning
        );


    /**
     * STEP 6:
     * Persist interaction
     * inside shared memory.
     */
    saveMemory({

        customerId,

        interaction,

        executionPlan,

        recommendations,

        explanations
    });


    /**
     * Final response.
     */
    return {

        executionPlan,

        agentOutputs,

        reasoning,

        recommendations,

        explanations
    };
}


module.exports = orchestrate;