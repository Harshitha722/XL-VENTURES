import { useEffect, useState } from "react";
import api from "../services/api";

function PlannerPage() {
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        async function fetchLatestAnalysis() {
            const response =
                await api.get("/latest-analysis");

            setAnalysis(response.data);
        }

        fetchLatestAnalysis();
    }, []);

    const executionPlan = analysis?.executionPlan || [];

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Planner Agent</p>
                    <h1>Execution Order</h1>
                </div>
            </section>

            {!analysis?.timestamp ? (
                <section className="result-panel empty-state">
                    <p>Upload documents to generate an execution plan.</p>
                </section>
            ) : (
                <section className="timeline-panel">
                    {executionPlan.map((agent, index) => (
                        <article key={agent} className="timeline-step">
                            <span>{index + 1}</span>
                            <div>
                                <h3>✓ {agent}</h3>
                                <p>Selected from uploaded document keywords.</p>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default PlannerPage;
