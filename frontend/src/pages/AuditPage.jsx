import { useEffect, useState } from "react";
import api from "../services/api";

function formatDate(value) {
    return value ? new Date(value).toLocaleString() : "-";
}

function AuditPage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/audit")
            .then((response) => {
                setEntries(response.data.entries || []);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Immutable Traceability</p>
                    <h1>Audit Log</h1>
                </div>
                <div className="status-panel">
                    <span className="status-dot" />
                    <span>{entries.length} events</span>
                </div>
            </section>

            {loading ? (
                <section className="result-panel empty-state">
                    <p>Loading audit log...</p>
                </section>
            ) : entries.length === 0 ? (
                <section className="result-panel empty-state">
                    <p>Recommendation and reviewer actions will appear here.</p>
                </section>
            ) : (
                <table className="breakdown-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Actor</th>
                            <th>Workspace</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.slice().reverse().map((entry) => (
                            <tr key={entry.id}>
                                <td>{formatDate(entry.createdAt)}</td>
                                <td>{entry.action}</td>
                                <td>{entry.entityType}</td>
                                <td>{entry.actorId}</td>
                                <td>{entry.workspaceId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}

export default AuditPage;
