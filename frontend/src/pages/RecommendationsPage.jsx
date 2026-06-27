import { useEffect, useState } from "react";
import api from "../services/api";

function RecommendationsPage() {
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        async function fetchLatestAnalysis() {
            const response =
                await api.get("/latest-analysis");

            setAnalysis(response.data);
        }

        fetchLatestAnalysis();
    }, []);

    const explanations = analysis?.explanations || [];

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Recommendation Agent</p>
                    <h1>Recommendations</h1>
                </div>
            </section>

            {!analysis?.timestamp ? (
                <section className="result-panel empty-state">
                    <p>Upload documents to generate recommendations.</p>
                </section>
            ) : (
                <section className="recommendation-list">
                    {explanations.map((item) => (
                        <article key={item.recommendation}>
                            <div>
                                <span
                                    className={`priority ${item.priority.toLowerCase()}`}
                                >
                                    {item.priority}
                                </span>
                                <h4>{item.recommendation}</h4>
                                <p>{item.reason}</p>
                                <ul className="evidence-list">
                                    {item.evidence.map((evidence) => (
                                        <li key={evidence}>{evidence}</li>
                                    ))}
                                </ul>
                            </div>
                            <strong>{item.confidence}%</strong>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default RecommendationsPage;
