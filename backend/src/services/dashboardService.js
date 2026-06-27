/**
 * DASHBOARD SERVICE
 *
 * Purpose:
 * Generate dashboard summaries
 * for a specific customer.
 */

const customers =
    require("../data/customers.json");

const contracts =
    require("../data/contracts.json");


function getDashboardData(customerId) {

    const customer = customers.find(
        c => c.id === Number(customerId)
    );

    const contract = contracts.find(
        c => c.customerId === Number(customerId)
    );

    if (!customer) {

        return {
            error: "Customer not found"
        };
    }

    /**
     * Simple health score.
     */
    let healthScore = 100;

    healthScore -=
        (10 - customer.nps) * 5;

    healthScore -=
        (100 - customer.featureAdoption) * 0.3;

    healthScore =
        Math.max(0, Math.round(healthScore));


    return {

        customer: {

            id: customer.id,

            name: customer.name,

            tier: customer.tier,

            mrr: customer.mrr
        },

        health: {

            score: healthScore,

            nps: customer.nps,

            csat: customer.csat,

            adoption: customer.featureAdoption,

            monthlyLogins:
                customer.monthlyLogins
        },

        renewal: {

            date:
                contract?.renewalDate,

            value:
                contract?.contractValue,

            autoRenew:
                contract?.autoRenew
        },

        opportunities:
            customer.openOpportunities
    };
}


module.exports = {
    getDashboardData
};