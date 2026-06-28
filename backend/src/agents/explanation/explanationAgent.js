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

            ].filter(
                (x) =>
                    !x.includes("undefined") &&
                    !x.includes("null")
            );

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

            ].filter(
                (x) =>
                    !x.includes("undefined") &&
                    !x.includes("null")
            );

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

            ].filter(
                (x) =>
                    !x.includes("undefined") &&
                    !x.includes("null")
            );

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

            ].filter(
                (x) =>
                    !x.includes("undefined") &&
                    !x.includes("null")
            );

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
         * NEW:
         * Missing Information Recommendations
         */
        else if (
            item.action ===
            "Collect Product Usage Analytics"
        ) {

            reason =
                "Product adoption metrics are missing from uploaded documents.";

            evidence = [];

            confidence = 65;
        }


        else if (
            item.action ===
            "Conduct Customer Satisfaction Survey"
        ) {

            reason =
                "No NPS or customer satisfaction metrics were detected.";

            evidence = [];

            confidence = 60;
        }


        else if (
            item.action ===
            "Request Contract Information"
        ) {

            reason =
                "Contract renewal details are unavailable.";

            evidence = [];

            confidence = 70;
        }


        else if (
            item.action ===
            "Verify Contract Value Information"
        ) {

            reason =
                "Contract value information is missing.";

            evidence = [];

            confidence = 55;
        }


        else if (
            item.action ===
            "Identify Executive Sponsor"
        ) {

            reason =
                "No executive sponsor or stakeholder was identified.";

            evidence =
                agentOutputs.CRMContextAgent?.stakeholders || [];

            confidence = 60;
        }


        else if (
            item.action ===
            "Schedule Renewal Planning Meeting"
        ) {

            reason =
                "Renewal planning activities have not been confirmed.";

            evidence = [];

            confidence = 55;
        }


        /**
         * Default
         */
        else {

            reason =
                "Generated from business reasoning rules.";

            evidence =
                orchestrationInput.evidence ||
                reasoning.risks;

            confidence = 75;
        }


        /**
         * Prefer actual document snippets.
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

    