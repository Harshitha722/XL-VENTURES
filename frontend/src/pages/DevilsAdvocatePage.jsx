import { useEffect, useState } from "react";
import api from "../services/api";

function DevilsAdvocatePage() {
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

    const review = analysis?.devilsAdvocateReview;

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Devil's Advocate Agent</p>
                    <h1>Critical Review</h1>
                </div>
            </section>

            {loading ? (
                <section className="result-panel empty-state">
                    <p>Loading Devil's Advocate review...</p>
                </section>
            ) : !review ? (
                <section className="result-panel empty-state">
                    <p>Upload documents to generate the analysis and scenario review.</p>
                </section>
            ) : (
                <section className="analysis-columns">
                    <article>
                        <h3>Best Option</h3>
                        <p>{review.scenarioName}</p>
                    </article>

                    <article>
                        <h3>Potential Weaknesses</h3>
                        <ul>
                            {review.potentialWeaknesses.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </article>

                    <article>
                        <h3>Alternative Considered</h3>
                        <p>{review.alternative.name}</p>
                        <p>{review.alternative.summary}</p>
                        <ul>
                            <li>Renewal: {review.alternative.renewalProbability}%</li>
                            <li>Churn: {review.alternative.churnProbability}%</li>
                            <li>Revenue: {review.alternative.revenueImpact}</li>
                            <li>Satisfaction: {review.alternative.customerSatisfaction}</li>
                            <li>Confidence: {review.alternative.confidence}%</li>
                        </ul>
                    </article>

                    <article>
                        <h3>Final Verdict</h3>
                        <p>{review.finalVerdict}</p>
                    </article>
                </section>
            )}
        </main>
    );
}

export default DevilsAdvocatePage;
