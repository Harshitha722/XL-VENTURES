const customers =
require("../data/customers.json");


function getRiskScore(customerId) {

    const customer = customers.find(

        c =>
        c.id === Number(customerId)
    );


    if (!customer) {

        return {

            error:
                "Customer not found"
        };
    }


    let score = 0;


    /**
     * NPS impact
     */
    score +=
        (10 - customer.nps) * 8;


    /**
     * Adoption impact
     */
    score +=
        (100 - customer.featureAdoption) * 0.5;


    /**
     * Escalation impact
     */
    score +=
        customer.previousEscalations * 10;


    score =
        Math.min(
            100,
            Math.round(score)
        );


    let label = "LOW";

    if (score > 70) {

        label = "HIGH";
    }

    else if (score > 40) {

        label = "MEDIUM";
    }


    return {

        customer:

            customer.name,

        riskScore:

            score,

        riskLevel:

            label
    };
}


module.exports = {
    getRiskScore
};