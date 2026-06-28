/**
 * AGENT REGISTRY
 *
 * Purpose:
 * Maintain a single source of truth
 * for all available business agents.
 *
 * DataCompletenessAgent is NOT included here
 * because it runs after all domain agents
 * and depends on their outputs.
 */

const customerHealthAgent =
    require("../../domains/customer-success/customerHealthAgent");

const crmContextAgent =
    require("../../domains/customer-success/crmContextAgent");

const contractAgent =
    require("../../domains/customer-success/contractAgent");

const knowledgeAgent =
    require("../../domains/customer-success/knowledgeAgent");


const AgentRegistry = {

    CustomerHealthAgent:
        customerHealthAgent,

    CRMContextAgent:
        crmContextAgent,

    ContractAgent:
        contractAgent,

    KnowledgeAgent:
        knowledgeAgent
};


module.exports =
    AgentRegistry;