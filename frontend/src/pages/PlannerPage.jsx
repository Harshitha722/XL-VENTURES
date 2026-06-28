import { useEffect, useState } from "react";
import api from "../services/api";

function PlannerPage() {

    const [analysis, setAnalysis] =
        useState(null);

    useEffect(() => {

        async function fetchLatestAnalysis() {

            const response =
                await api.get(
                    "/latest-analysis"
                );

            setAnalysis(
                response.data
            );
        }

        fetchLatestAnalysis();

    }, []);


    const executionPlan =
        analysis?.executionPlan || [];


    return (

        <main className="dashboard-shell">

            <section className="intake-header">

                <div>

                    <p className="eyebrow">
                        Planner Agent
                    </p>

                    <h1>
                        Execution Order
                    </h1>

                </div>

            </section>


            {!analysis?.timestamp ? (

                <section
                    className="result-panel empty-state"
                >

                    <p>
                        Upload documents to generate an execution plan.
                    </p>

                </section>

            ) : (

                <>

                    <section
                        className="result-panel"
                    >

                        <h3>
                            Planner Decision
                        </h3>

                        <p>
                            The planner analyzed uploaded
                            documents and selected the
                            following agents for execution.
                        </p>

                    </section>


                    <section
                        className="timeline-panel"
                    >

                        {executionPlan.map(
                            (agent, index) => (

                                <article
                                    key={agent}
                                    className="timeline-step"
                                >

                                    <span>
                                        {index + 1}
                                    </span>

                                    <div>

                                        <h3>
                                            ✓ {agent}
                                        </h3>

                                        <p>

                                            {
                                                agent ===
                                                    "CustomerHealthAgent"
                                                    ? "Detects adoption, NPS, satisfaction, and churn indicators."

                                                    : agent ===
                                                        "ContractAgent"
                                                        ? "Extracts contract value, renewals, discounts, and SLA terms."

                                                        : agent ===
                                                            "CRMContextAgent"
                                                            ? "Finds opportunities, stakeholders, and escalation signals."

                                                            : agent ===
                                                                "KnowledgeAgent"
                                                                ? "Matches internal playbooks and best practices."

                                                                : agent ===
                                                                    "DataCompletenessAgent"
                                                                    ? "Measures available information and detects missing business data."

                                                                    : "Selected from uploaded document content."
                                            }

                                        </p>

                                    </div>

                                </article>
                            )
                        )}

                    </section>

                </>
            )}

        </main>
    );
}

export default PlannerPage;