/**
 * ARCHITECTURE SERVICE
 *
 * Purpose:
 * Expose the RenewAI architecture
 * to the frontend for visualization.
 */

function getArchitecture() {

    return {

        title:
            "RenewAI Agentic Decision Intelligence Platform",

        layers: [

            {
                name: "Input Layer",

                components: [

                    "Meeting Transcripts",
                    "Emails",
                    "Support Tickets",
                    "CRM Notes"
                ]
            },

            {
                name: "Planner Layer",

                components: [
                    "Planner Agent"
                ]
            },

            {
                name: "Execution Layer",

                components: [

                    "CustomerHealthAgent",

                    "CRMContextAgent",

                    "ContractAgent",

                    "KnowledgeAgent"
                ]
            },

            {
                name: "Intelligence Layer",

                components: [

                    "BusinessReasoningAgent",

                    "RecommendationAgent",

                    "ExplanationAgent"
                ]
            },

            {
                name: "Memory Layer",

                components: [

                    "Shared Memory",

                    "Human Feedback"
                ]
            }
        ]
    };
}


module.exports = {
    getArchitecture
};