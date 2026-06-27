/**
 * DASHBOARD SERVICE
 *
 * Purpose:
 * Generate dashboard summaries from
 * the latest document-driven analysis.
 */

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


function getDashboardData() {

    const analysis = loadLatestAnalysis();

    if (!analysis.timestamp) {

        return {
            risks: [],
            renewalDate: null,
            contractValue: null,
            adoption: null,
            nps: null,
            recommendationCount: 0
        };
    }

    const health =
        analysis.agentOutputs?.CustomerHealthAgent || {};

    const contract =
        analysis.agentOutputs?.ContractAgent || {};

    const risks =
        analysis.reasoning?.risks || [];

    const recommendations =
        analysis.recommendations || [];

    return {
        risks,
        renewalDate:
            contract.renewalDate || null,
        contractValue:
            contract.contractValue || null,
        adoption:
            health.adoption ?? null,
        nps:
            health.nps ?? null,
        recommendationCount:
            recommendations.length
    };
}


module.exports = {
    getDashboardData
};
