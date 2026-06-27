const contracts = require("../../data/contracts.json");

/**
 * Contract Agent
 *
 * Purpose:
 * Read contract details and
 * renewal information.
 */
function contractAgent(customerId) {

    const contract = contracts.find(
        c => c.customerId === customerId
    );

    if (!contract) {
        return {
            error: "Contract not found"
        };
    }

    return {

        renewalDate:
            contract.renewalDate,

        contractValue:
            contract.contractValue,

        autoRenew:
            contract.autoRenew,

        discountAllowed:
            contract.discountAllowed,

        maxDiscountPercent:
            contract.maxDiscountPercent,

        sla:
            contract.sla
    };
}

module.exports = contractAgent;