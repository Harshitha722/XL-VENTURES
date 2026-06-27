const plannerAgent =
require("./agents/planner/plannerAgent");


const interaction =

"We are unhappy with adoption and may not renew our contract.";


const executionPlan =
plannerAgent(interaction);


console.log(
    "===== EXECUTION PLAN ====="
);

console.log(
    executionPlan
);