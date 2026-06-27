import { useEffect, useState } from "react";
import api from "../services/api";

function DashboardPage() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestAnalysis() {
            try {
                const response =
                    await api.get("/latest-analysis");

                setAnalysis(response.data);
            }
            finally {
                setLoading(false);
            }
        }

        fetchLatestAnalysis();
    }, []);

    if (loading) {
        return (
            <main className="page">
                <h1>Dashboard</h1>
                <p>Loading latest analysis...</p>
            </main>
        );
    }

    if (!analysis?.timestamp) {
        return (
            <main className="page empty-page">
                <h1>Dashboard</h1>
                <p>Upload documents to generate the first analysis.</p>
            </main>
        );
    }

    const health = analysis.agentOutputs.CustomerHealthAgent || {};
    const contract = analysis.agentOutputs.ContractAgent || {};
    const crm = analysis.agentOutputs.CRMContextAgent || {};

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Latest analysis</p>
                    <h1>{crm.tier ? `${crm.tier} Customer` : "Document Dashboard"}</h1>
                </div>
                <div className="status-panel">
                    <span className="status-dot" />
                    <span>{analysis.recommendations.length} recommendations</span>
                </div>
            </section>

            <section className="metric-grid dashboard-metrics">
                <article>
                    <span>Risks</span>
                    <strong>{analysis.reasoning.risks.length}</strong>
                </article>
                <article>
                    <span>Renewal Date</span>
                    <strong>{contract.renewalDate || "-"}</strong>
                </article>
                <article>
                    <span>Contract Value</span>
                    <strong>
                        {contract.contractValue
                            ? `$${contract.contractValue.toLocaleString()}`
                            : "-"}
                    </strong>
                </article>
                <article>
                    <span>Adoption</span>
                    <strong>{health.adoption ?? "-"}</strong>
                </article>
                <article>
                    <span>NPS</span>
                    <strong>{health.nps ?? "-"}</strong>
                </article>
                <article>
                    <span>Recommendation Count</span>
                    <strong>{analysis.recommendations.length}</strong>
                </article>
            </section>

            <section className="analysis-columns dashboard-lists">
                <div>
                    <h3>Risks</h3>
                    <ul>
                        {analysis.reasoning.risks.map((risk) => (
                            <li key={risk}>{risk}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Top Recommendations</h3>
                    <ul>
                        {analysis.recommendations.map((item) => (
                            <li key={item.action}>
                                {item.priority}: {item.action}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}

export default DashboardPage;
