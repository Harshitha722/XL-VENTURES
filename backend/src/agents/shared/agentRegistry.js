/**
 * AGENT REGISTRY
 *
 * Purpose:
 * Maintain a single source of truth
 * for all available agents.
 *
 * Future domains can register their
 * agents here without changing the
 * planner or orchestration logic.
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


module.exports = AgentRegistry;