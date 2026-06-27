const fs = require("fs");
const path = require("path");

const LATEST_ANALYSIS_PATH = path.join(
    __dirname,
    "../data/latestAnalysis.json"
);


function loadLatestAnalysis() {

    const raw = fs.readFileSync(
        LATEST_ANALYSIS_PATH,
        "utf8"
    );

    return JSON.parse(raw || "{}");
}


function getRiskScore() {

    const analysis = loadLatestAnalysis();

    if (!analysis.timestamp) {

        return {
            riskScore: 0,
            riskLevel: "UNKNOWN",
            risks: []
        };
    }

    const health =
        analysis.agentOutputs?.CustomerHealthAgent || {};

    const crm =
        analysis.agentOutputs?.CRMContextAgent || {};

    const risks =
        analysis.reasoning?.risks || [];


    let score = 0;


    /**
     * NPS impact
     */
    if (typeof health.nps === "number") {

        score +=
            (10 - health.nps) * 8;
    }


    /**
     * Adoption impact
     */
    if (typeof health.adoption === "number") {

        score +=
            (100 - health.adoption) * 0.5;
    }


    /**
     * Escalation impact
     */
    if (typeof crm.escalations === "number") {

        score +=
            crm.escalations * 10;
    }

    score +=
        risks.length * 5;


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

        riskScore:

            score,

        riskLevel:

            label,

        risks
    };
}


module.exports = {
    getRiskScore
};
