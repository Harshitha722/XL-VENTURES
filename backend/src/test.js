const customerHealthAgent =
    require("./domains/customer-success/customerHealthAgent");

const crmContextAgent =
    require("./domains/customer-success/crmContextAgent");

const contractAgent =
    require("./domains/customer-success/contractAgent");

const knowledgeAgent =
    require("./domains/customer-success/knowledgeAgent");


console.log("===== CUSTOMER HEALTH =====");
console.log(customerHealthAgent(1));

console.log("\n===== CRM CONTEXT =====");
console.log(crmContextAgent(1));

console.log("\n===== CONTRACT =====");
console.log(contractAgent(1));

console.log("\n===== KNOWLEDGE =====");
console.log(knowledgeAgent("low_adoption"));