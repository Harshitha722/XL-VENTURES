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
    reasoning,
    orchestrationInput = {}
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
            ].filter((item) => !item.includes("undefined") && !item.includes("null"));

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
            ].filter((item) => !item.includes("undefined") && !item.includes("null"));

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
            ].filter((item) => !item.includes("undefined") && !item.includes("null"));

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
            ].filter((item) => !item.includes("undefined") && !item.includes("null"));

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
                orchestrationInput.evidence || reasoning.risks;

            confidence = 75;
        }

        /**
         * Prefer real uploaded-document snippets whenever available.
         */
        if (orchestrationInput.evidence?.length) {
            evidence = [
                ...orchestrationInput.evidence.slice(0, 3),
                ...evidence
            ].slice(0, 5);
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
