/**
 * BUSINESS REASONING AGENT
 *
 * Purpose:
 * Combine outputs from all domain agents
 * and generate business insights.
 */

function businessReasoningAgent(agentOutputs) {

    const risks = [];

    const opportunities = [];

    const missingInformation = [];


    const health =
        agentOutputs.CustomerHealthAgent;

    const contract =
        agentOutputs.ContractAgent;

    const crm =
        agentOutputs.CRMContextAgent;

    const knowledge =
        agentOutputs.KnowledgeAgent;

    const completeness =
        agentOutputs.DataCompletenessAgent;


    /**
     * CUSTOMER HEALTH ANALYSIS
     */
    if (health) {

        if (health.risk === "high") {

            risks.push(
                "churn risk"
            );
        }

        if (

            health.nps !== null &&
            health.nps !== undefined &&
            health.nps < 5

        ) {

            risks.push(
                "customer dissatisfaction"
            );
        }

        if (

            health.adoption !== null &&
            health.adoption !== undefined &&
            health.adoption < 50

        ) {

            risks.push(
                "low product adoption"
            );
        }
    }


    /**
     * CONTRACT ANALYSIS
     */
    if (contract) {

        if (contract.autoRenew === false) {

            risks.push(
                "renewal risk"
            );
        }

        if (contract.discountAllowed) {

            opportunities.push(
                "retention discount strategy"
            );
        }
    }


    /**
     * CRM ANALYSIS
     */
    if (crm) {

        if (

            crm.opportunities &&
            crm.opportunities.length > 0

        ) {

            opportunities.push(
                "upsell opportunity"
            );
        }

        if (crm.escalations > 1) {

            risks.push(
                "frequent escalations"
            );
        }
    }


    /**
     * DATA COMPLETENESS
     */
    if (completeness) {

        missingInformation.push(
            ...completeness.missing
        );
    }


    /**
     * Additional future checks.
     */
    missingInformation.push(
        "renewal meeting confirmation"
    );


    return {

        risks:
            [...new Set(risks)],

        opportunities:
            [...new Set(opportunities)],

        missingInformation:
            [...new Set(missingInformation)],

        dataCompleteness:
            completeness,

        knowledgeGuidance:
            knowledge?.playbooks?.map((playbook) => ({
                title: playbook.trigger,
                action: playbook.action,
                category: playbook.category,
                source: playbook.source,
                score: playbook.score
            })) || []
    };
}


module.exports =
    businessReasoningAgent;
