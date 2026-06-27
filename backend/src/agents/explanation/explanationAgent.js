/**
 * EXPLANATION AGENT
 *
 * Purpose:
 * Explain every recommendation
 * using reasons, evidence,
 * and confidence scores.
 */

function explanationAgent(
    recommendations,
    agentOutputs,
    reasoning
) {

    return recommendations.map((item) => {

        let reason = "";

        let evidence = [];

        let confidence = 70;


        /**
         * Executive Review
         */
        if (
            item.action ===
            "Schedule Executive Business Review"
        ) {

            reason =
                "Customer exhibits strong churn indicators.";

            evidence = [

                `NPS: ${agentOutputs.CustomerHealthAgent?.nps}`,

                `Adoption: ${agentOutputs.CustomerHealthAgent?.adoption}%`,

                `Escalations: ${agentOutputs.CRMContextAgent?.escalations}`
            ];

            confidence = 92;
        }


        /**
         * Adoption Workshop
         */
        else if (
            item.action ===
            "Conduct Adoption Workshop"
        ) {

            reason =
                "Feature adoption is below acceptable levels.";

            evidence = [

                `Adoption: ${agentOutputs.CustomerHealthAgent?.adoption}%`
            ];

            confidence = 88;
        }


        /**
         * Renewal Discussion
         */
        else if (
            item.action ===
            "Initiate Renewal Discussion"
        ) {

            reason =
                "Contract requires proactive renewal management.";

            evidence = [

                `Renewal Date: ${agentOutputs.ContractAgent?.renewalDate}`,

                `Auto Renew: ${agentOutputs.ContractAgent?.autoRenew}`
            ];

            confidence = 85;
        }


        /**
         * Discount Recommendation
         */
        else if (
            item.action ===
            "Offer Renewal Incentive"
        ) {

            reason =
                "Retention incentives are permitted by contract.";

            evidence = [

                `Discount Allowed: ${agentOutputs.ContractAgent?.discountAllowed}`,

                `Max Discount: ${agentOutputs.ContractAgent?.maxDiscountPercent}%`
            ];

            confidence = 82;
        }


        /**
         * Upsell
         */
        else if (
            item.action ===
            "Explore Upsell Opportunities"
        ) {

            reason =
                "Existing expansion opportunities are available.";

            evidence =
                agentOutputs.CRMContextAgent?.opportunities || [];

            confidence = 80;
        }


        /**
         * Default Explanation
         */
        else {

            reason =
                "Generated from business reasoning rules.";

            evidence =
                reasoning.risks;

            confidence = 75;
        }


        return {

            recommendation:
                item.action,

            priority:
                item.priority,

            reason,

            evidence,

            confidence
        };
    });
}


module.exports =
    explanationAgent;