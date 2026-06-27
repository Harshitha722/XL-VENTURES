const customers = require("../../data/customers.json");

/**
 * Customer Health Agent
 *
 * Purpose:
 * Analyze customer usage, adoption,
 * NPS, and CSAT scores.
 */
function customerHealthAgent(customerId) {

    // Find customer
    const customer = customers.find(
        c => c.id === customerId
    );

    if (!customer) {
        return {
            error: "Customer not found"
        };
    }

    // Default risk
    let risk = "low";

    // Simple business rules
    if (
        customer.featureAdoption < 50 ||
        customer.nps < 5
    ) {
        risk = "high";
    }

    return {

        usage: customer.monthlyLogins,

        adoption: customer.featureAdoption,

        nps: customer.nps,

        csat: customer.csat,

        risk
    };
}

module.exports = customerHealthAgent;