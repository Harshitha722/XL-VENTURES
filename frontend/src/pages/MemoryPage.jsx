import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function formatDate(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getApprovedRecommendations(memory) {
    return memory.flatMap((entry, entryIndex) => {
        const approvals = entry.approvedRecommendations || [];

        return approvals.map((approval, approvalIndex) => ({
            ...approval,
            entryIndex,
            approvalIndex,
            analysisTimestamp: entry.analysisTimestamp,
            memoryTimestamp: entry.timestamp,
            reviewedAt: entry.reviewedAt
        }));
    });
}

function MemoryPage() {
    const [memory, setMemory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchMemory() {
            try {
                const response = await api.get("/memory");

                setMemory(Array.isArray(response.data) ? response.data : []);
            }
            catch {
                setError("Unable to load memory.");
            }
            finally {
                setLoading(false);
            }
        }

        fetchMemory();
    }, []);

    const approvedRecommendations = useMemo(
        () => getApprovedRecommendations(memory),
        [memory]
    );

    if (loading) {
        return (
            <main className="dashboard-shell">
                <section className="intake-header">
                    <div>
                        <p className="eyebrow">Shared Memory</p>
                        <h1>Memory</h1>
                    </div>
                </section>
                <section className="result-panel empty-state">
                    <p>Loading memory...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Shared Memory</p>
                    <h1>Memory</h1>
                </div>
                <div className="status-panel">
                    <span className="status-dot" />
                    <span>{approvedRecommendations.length} approved</span>
                </div>
            </section>

            {error ? (
                <div className="error-banner">{error}</div>
            ) : null}

            <section className="metric-grid memory-metrics">
                <article>
                    <span>Total Entries</span>
                    <strong>{memory.length}</strong>
                </article>
                <article>
                    <span>Approved Recommendations</span>
                    <strong>{approvedRecommendations.length}</strong>
                </article>
            </section>

            {approvedRecommendations.length === 0 ? (
                <section className="result-panel empty-state">
                    <p>Approved recommendations will appear here.</p>
                </section>
            ) : (
                <section className="memory-list">
                    {approvedRecommendations.map((item) => (
                        <article
                            key={`${item.entryIndex}-${item.approvalIndex}-${item.recommendation}`}
                        >
                            <div className="memory-card-header">
                                <span
                                    className={`priority ${(item.priority || "medium").toLowerCase()}`}
                                >
                                    {item.priority || "APPROVED"}
                                </span>
                                <span className="memory-date">
                                    {formatDate(item.approvedAt || item.reviewedAt)}
                                </span>
                            </div>

                            <h3>{item.recommendation}</h3>
                            <p>{item.reason}</p>

                            <div className="memory-meta">
                                <span>Status: {item.status || "approved"}</span>
                                <span>Confidence: {item.confidence ?? "-"}%</span>
                            </div>

                            {item.evidence?.length ? (
                                <ul className="evidence-list">
                                    {item.evidence.map((evidence) => (
                                        <li key={evidence}>{evidence}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default MemoryPage;
