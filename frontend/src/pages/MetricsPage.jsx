import { useEffect, useState } from "react";
import api from "../services/api";

export default function MetricsPage() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/metrics")
            .then((response) => {
                setMetrics(response.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="page">Loading metrics...</div>;
    if (!metrics) return <div className="page">Failed to load metrics.</div>;

    const platform = metrics.platform;
    const businessTargets = metrics.businessTargets;

    return (
        <div className="page metrics-page">
            <h1>Platform Metrics & Business Outcomes</h1>
            <p className="subtitle">Measurable evaluation of DecisionMesh AI recommendation quality</p>

            <section>
                <h2>Platform Performance</h2>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-value">{platform.totalAnalysesRun}</div>
                        <div className="metric-label">Analyses Run</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">{platform.totalRecommendationsApproved}</div>
                        <div className="metric-label">Recommendations Approved</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">{platform.recommendationAcceptanceRate}</div>
                        <div className="metric-label">Acceptance Rate</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">{platform.averageConfidenceOfApprovedActions}</div>
                        <div className="metric-label">Avg Confidence Approved</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">{platform.totalRecommendationsRejected}</div>
                        <div className="metric-label">Recommendations Rejected</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">{platform.memoryGrowth}</div>
                        <div className="metric-label">Memory Growth</div>
                    </div>
                </div>
                {platform.mostFrequentApprovedAction !== "N/A" && (
                    <p>Most frequently approved action: <strong>{platform.mostFrequentApprovedAction}</strong></p>
                )}
            </section>

            {Object.keys(metrics.reviewerPerformance || {}).length > 0 && (
                <section>
                    <h2>Reviewer Performance</h2>
                    <table className="breakdown-table">
                        <thead>
                            <tr>
                                <th>Reviewer</th>
                                <th>Reviewed</th>
                                <th>Approved</th>
                                <th>Rejected</th>
                                <th>Escalated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(metrics.reviewerPerformance).map(([reviewer, stats]) => (
                                <tr key={reviewer}>
                                    <td>{reviewer}</td>
                                    <td>{stats.reviewed}</td>
                                    <td>{stats.approved}</td>
                                    <td>{stats.rejected}</td>
                                    <td>{stats.escalated}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {metrics.discoveredPatterns?.length > 0 && (
                <section>
                    <h2>Discovered Patterns</h2>
                    <table className="breakdown-table">
                        <thead>
                            <tr>
                                <th>Recommendation</th>
                                <th>Approvals</th>
                                <th>Rejections</th>
                                <th>Acceptance Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.discoveredPatterns.map((pattern) => (
                                <tr key={pattern.recommendation}>
                                    <td>{pattern.recommendation}</td>
                                    <td>{pattern.approvals}</td>
                                    <td>{pattern.rejections}</td>
                                    <td>{pattern.acceptanceRate ?? "N/A"}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            <section>
                <h2>Business Success Targets</h2>
                <ul className="targets-list">
                    {Object.entries(businessTargets).map(([key, value]) => (
                        <li key={key}>
                            <span className="target-label">{key.replace(/([A-Z])/g, " $1")}:</span> {value}
                        </li>
                    ))}
                </ul>
            </section>

            {Object.keys(metrics.actionBreakdown || {}).length > 0 && (
                <section>
                    <h2>Action Breakdown Approved</h2>
                    <table className="breakdown-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Times Approved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(metrics.actionBreakdown)
                                .sort((a, b) => b[1] - a[1])
                                .map(([action, count]) => (
                                    <tr key={action}>
                                        <td>{action}</td>
                                        <td>{count}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
}
