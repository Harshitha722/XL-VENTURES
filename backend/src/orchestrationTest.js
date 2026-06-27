const orchestrate =
require("./services/orchestrationService");


const result = orchestrate(

    1,

    "We are unhappy with adoption and may not renew our contract."
);


console.log(

    JSON.stringify(
        result,
        null,
        4
    )
);