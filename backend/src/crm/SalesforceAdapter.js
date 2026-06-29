const MockCRMAdapter = require("./MockCRMAdapter");

class SalesforceAdapter extends MockCRMAdapter {
    constructor() {
        super();
        this.provider = "salesforce";
    }
}

module.exports = SalesforceAdapter;
