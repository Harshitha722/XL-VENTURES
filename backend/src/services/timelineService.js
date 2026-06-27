const contracts =
require("../data/contracts.json");


function getRenewalTimeline(customerId) {

    const contract = contracts.find(

        c =>
        c.customerId === Number(customerId)
    );


    if (!contract) {

        return {

            error:
                "Contract not found"
        };
    }


    return {

        renewalDate:
            contract.renewalDate,

        milestones: [

            {

                title:
                    "Renewal Discussion",

                daysBefore:
                    90
            },

            {

                title:
                    "Executive Review",

                daysBefore:
                    60
            },

            {

                title:
                    "Retention Offer",

                daysBefore:
                    30
            }
        ]
    };
}


module.exports = {
    getRenewalTimeline
};