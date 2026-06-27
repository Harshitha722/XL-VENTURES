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


function getTargetDate(renewalDate, daysBefore) {

    const parsed = new Date(renewalDate);

    if (Number.isNaN(parsed.getTime())) {

        return null;
    }

    parsed.setDate(
        parsed.getDate() - daysBefore
    );

    return parsed.toISOString().slice(0, 10);
}


function getRenewalTimeline() {

    const analysis = loadLatestAnalysis();

    const renewalDate =
        analysis.agentOutputs?.ContractAgent?.renewalDate;

    if (!renewalDate) {

        return {
            renewalDate: null,
            milestones: []
        };
    }


    return {

        renewalDate:
            renewalDate,

        milestones: [

            {

                title:
                    "Renewal Discussion",

                daysBefore:
                    90,

                targetDate:
                    getTargetDate(renewalDate, 90)
            },

            {

                title:
                    "Executive Review",

                daysBefore:
                    60,

                targetDate:
                    getTargetDate(renewalDate, 60)
            },

            {

                title:
                    "Retention Offer",

                daysBefore:
                    30,

                targetDate:
                    getTargetDate(renewalDate, 30)
            }
        ]
    };
}


module.exports = {
    getRenewalTimeline
};
