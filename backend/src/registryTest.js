const AgentRegistry =
require("./agents/shared/agentRegistry");


console.log(
    AgentRegistry["CustomerHealthAgent"](1)
);

console.log(
    AgentRegistry["CRMContextAgent"](1)
);

console.log(
    AgentRegistry["ContractAgent"](1)
);

console.log(
    AgentRegistry["KnowledgeAgent"](
        "low_adoption"
    )
);