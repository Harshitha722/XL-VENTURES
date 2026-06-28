import { useEffect, useState } from "react";
import api from "../services/api";

function ScenarioAnalysisPage() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestAnalysis() {
            try {
                const response = await api.get("/latest-analysis");
                setAnalysis(response.data);
            } finally {
                setLoading(false);
            }
        }

        fetchLatestAnalysis();
    }, []);

    const scenarios = analysis?.scenarioAnalysis?.scenarios || [];
    const selectedId = analysis?.scenarioAnalysis?.selectedScenarioId;

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Scenario Simulation Agent</p>
                    <h1>Scenario Analysis</h1>
                </div>
            </section>

            {loading ? (
                <section className="result-panel empty-state">
                    <p>Loading scenario analysis...</p>
                </section>
            ) : !scenarios.length ? (
                <section className="result-panel empty-state">
                    <p>Upload documents to generate scenario simulations.</p>
                </section>
            ) : (
                <section className="analysis-columns">
                    {scenarios.map((scenario) => (
                        <article
                            key={scenario.id}
                            className={scenario.id === selectedId ? "selected-card" : ""}
                        >
                            <h3>{scenario.name}</h3>
                            <p>{scenario.summary}</p>
                            <ul>
                                <li>Renewal: {scenario.renewalProbability}%</li>
                                <li>Revenue: {scenario.revenueImpact}</li>
                                <li>Churn: {scenario.churnProbability}%</li>
                                <li>Satisfaction: {scenario.customerSatisfaction}</li>
                                <li>Confidence: {scenario.confidence}%</li>
                            </ul>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default ScenarioAnalysisPage;
