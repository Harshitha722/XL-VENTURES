const customers = require("../../data/customers.json");

/**
 * CRM Context Agent
 *
 * Purpose:
 * Return CRM-related information.
 */
function crmContextAgent(customerId) {

    const customer = customers.find(
        c => c.id === customerId
    );

    if (!customer) {
        return {
            error: "Customer not found"
        };
    }

    return {

        tier: customer.tier,

        mrr: customer.mrr,

        escalations:
            customer.previousEscalations,

        opportunities:
            customer.openOpportunities
    };
}

module.exports = crmContextAgent;