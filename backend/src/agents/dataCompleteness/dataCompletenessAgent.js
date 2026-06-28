/**
 * DATA COMPLETENESS AGENT
 *
 * Purpose:
 * Detect what information exists
 * and what information is missing.
 *
 * This prevents the system from
 * making weak decisions when
 * important business data is absent.
 */

function dataCompletenessAgent(agentOutputs) {

    const available = [];

    const missing = [];


    const health =
        agentOutputs.CustomerHealthAgent;

    const contract =
        agentOutputs.ContractAgent;

    const crm =
        agentOutputs.CRMContextAgent;


    /**
     * HEALTH METRICS
     */
    if (health?.adoption !== null &&
        health?.adoption !== undefined) {

        available.push(
            "adoption metrics"
        );
    }
    else {

        missing.push(
            "adoption metrics"
        );
    }


    if (health?.nps !== null &&
        health?.nps !== undefined) {

        available.push(
            "NPS score"
        );
    }
    else {

        missing.push(
            "NPS score"
        );
    }


    /**
     * CONTRACT DATA
     */
    if (contract?.renewalDate) {

        available.push(
            "renewal date"
        );
    }
    else {

        missing.push(
            "renewal date"
        );
    }


    if (contract?.contractValue) {

        available.push(
            "contract value"
        );
    }
    else {

        missing.push(
            "contract value"
        );
    }


    /**
     * CRM DATA
     */
    if (crm?.stakeholders?.length) {

        available.push(
            "executive sponsor"
        );
    }
    else {

        missing.push(
            "executive sponsor"
        );
    }


    /**
     * Confidence score
     */
    const totalFields =
        available.length + missing.length;

    const confidence =
        Math.round(
            (available.length / totalFields) * 100
        );


    return {

        available,

        missing,

        confidence
    };
}


module.exports =
    dataCompletenessAgent;