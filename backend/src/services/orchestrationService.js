/**
 * ORCHESTRATION SERVICE
 *
 * Purpose:
 * Execute the complete workflow:
 *
 * Interaction
 *    ↓
 * Planner Agent
 *    ↓
 * Agent Registry
 *    ↓
 * Execute Selected Agents
 *    ↓
 * Collect Outputs
 */

const plannerAgent =
    require("../agents/planner/plannerAgent");

const AgentRegistry =
    require("../agents/shared/agentRegistry");


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

        if (!agent) {
            return;
        }

        /**
         * Knowledge Agent expects
         * a problem type.
         */
        if (agentName === "KnowledgeAgent") {

            agentOutputs[agentName] =
                agent("low_adoption");
        }

        /**
         * All other agents use customerId.
         */
        else {

            agentOutputs[agentName] =
                agent(customerId);
        }

    });

    /**
     * Return everything.
     */
    return {

        executionPlan,

        agentOutputs
    };
}


module.exports = orchestrate;