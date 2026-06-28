const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");

function ruleBasedExplanations(
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

            timeline:
                item.timeline,

            impact:
                item.impact,

            reason,

            businessImpact:
                item.impact || "Recommended action supports the current business priorities.",

            evidence,

            confidence
        };
    });
}

function normalizeExplanation(parsed, fallback, documentEvidence) {
    if (!parsed || typeof parsed !== "object") {
        return fallback;
    }

    const evidence = Array.isArray(parsed.evidence)
        ? parsed.evidence.filter((item) => typeof item === "string" && item.trim())
        : [];

    return {
        ...fallback,

        reason:
            typeof parsed.reason === "string" && parsed.reason.trim()
                ? parsed.reason.trim()
                : fallback.reason,

        confidence:
            Number.isFinite(Number(parsed.confidence))
                ? Math.max(0, Math.min(100, Math.round(Number(parsed.confidence))))
                : fallback.confidence,

        businessImpact:
            typeof parsed.businessImpact === "string" && parsed.businessImpact.trim()
                ? parsed.businessImpact.trim()
                : fallback.businessImpact,

        evidence: [
            ...documentEvidence,
            ...evidence,
            ...(fallback.evidence || [])
        ]
            .filter(Boolean)
            .filter((item, index, self) => self.indexOf(item) === index)
            .slice(0, 5)
    };
}

async function explanationAgent(
    recommendations,
    agentOutputs,
    reasoning,
    orchestrationInput = {}
) {
    const fallbacks = ruleBasedExplanations(
        recommendations,
        agentOutputs,
        reasoning,
        orchestrationInput
    );

    const documentEvidence = orchestrationInput.evidence || [];

    try {
        const explanations = [];

        for (const fallback of fallbacks) {
            const recommendation = recommendations.find(
                (item) => item.action === fallback.recommendation
            ) || {};

            const prompt = `
You are an enterprise explanation engine.

Recommendation:

${JSON.stringify(recommendation, null, 2)}

Business Analysis:

${JSON.stringify(reasoning, null, 2)}

Evidence:

${JSON.stringify(documentEvidence, null, 2)}

Return ONLY valid JSON:

{
  "reason": "The customer exhibits declining adoption and upcoming renewal deadlines.",
  "confidence": 91,
  "businessImpact": "Proactive engagement reduces churn risk.",
  "evidence": [
    "...",
    "..."
  ]
}
`;

            const response = await askGemini(prompt);
            const parsed = parseJsonSafely(response, fallback);

            explanations.push(
                normalizeExplanation(parsed, fallback, documentEvidence.slice(0, 3))
            );
        }

        return explanations;
    }
    catch (error) {
        return fallbacks;
    }
}

explanationAgent.ruleBasedExplanations = ruleBasedExplanations;


module.exports =
    explanationAgent;

    
