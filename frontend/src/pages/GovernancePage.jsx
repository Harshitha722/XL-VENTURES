import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const reviewActions = [
    "approve",
    "reject",
    "escalate",
    "delegate",
    "request_information",
    "override",
    "archive"
];

function formatAction(action) {
    return action.replace("_", " ");
}

function GovernancePage() {
    const [memory, setMemory] = useState([]);
    const [selectedAction, setSelectedAction] = useState("approve");
    const [comment, setComment] = useState("");
    const [delegateTo, setDelegateTo] = useState("");
    const [overrideRecommendation, setOverrideRecommendation] = useState("");
    const [savingKey, setSavingKey] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/memory").then((response) => {
            setMemory(Array.isArray(response.data) ? response.data : []);
        });
    }, []);

    const queue = useMemo(() => {
        return memory
            .filter((entry) => entry.type === "analysis" && entry.explanations?.length)
            .flatMap((entry) =>
                entry.explanations.map((item) => ({
                    ...item,
                    memoryIndex: entry.index,
                    analysisTimestamp: entry.timestamp,
                    tenantId: entry.tenantId,
                    workspaceId: entry.workspaceId,
                    reviewHistory: entry.reviewHistory || []
                }))
            )
            .slice(-20)
            .reverse();
    }, [memory]);

    async function submitReview(item) {
        const key = `${item.memoryIndex}-${item.recommendation}`;
        setSavingKey(key);
        setMessage("");

        try {
            await api.post("/memory/review-action", {
                index: item.memoryIndex,
                recommendation: item.recommendation,
                action: selectedAction,
                comment,
                delegateTo,
                overrideRecommendation
            });

            setMessage(`${formatAction(selectedAction)} saved for ${item.recommendation}.`);
            setComment("");
            setDelegateTo("");
            setOverrideRecommendation("");

            const response = await api.get("/memory");
            setMemory(Array.isArray(response.data) ? response.data : []);
        }
        finally {
            setSavingKey("");
        }
    }

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Human-in-the-loop Governance</p>
                    <h1>Review Queue</h1>
                </div>
                <div className="status-panel">
                    <span className="status-dot" />
                    <span>{queue.length} review items</span>
                </div>
            </section>

            <section className="governance-controls">
                <label>
                    Review action
                    <select value={selectedAction} onChange={(event) => setSelectedAction(event.target.value)}>
                        {reviewActions.map((action) => (
                            <option key={action} value={action}>
                                {formatAction(action)}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Comment
                    <input value={comment} onChange={(event) => setComment(event.target.value)} />
                </label>
                <label>
                    Delegate to
                    <input value={delegateTo} onChange={(event) => setDelegateTo(event.target.value)} />
                </label>
                <label>
                    Override recommendation
                    <input
                        value={overrideRecommendation}
                        onChange={(event) => setOverrideRecommendation(event.target.value)}
                    />
                </label>
            </section>

            {message ? <div className="success-banner">{message}</div> : null}

            {queue.length === 0 ? (
                <section className="result-panel empty-state">
                    <p>Run an analysis to create governed recommendation reviews.</p>
                </section>
            ) : (
                <section className="recommendation-list">
                    {queue.map((item) => {
                        const key = `${item.memoryIndex}-${item.recommendation}`;
                        const latestReview = item.reviewHistory.at(-1);

                        return (
                            <article key={key}>
                                <div>
                                    <span className={`priority ${(item.priority || "medium").toLowerCase()}`}>
                                        {item.priority || "MEDIUM"}
                                    </span>
                                    <h4>{item.recommendation}</h4>
                                    <p>{item.reason}</p>
                                    <p>
                                        <strong>Confidence:</strong> {item.confidence ?? 0}%
                                    </p>
                                    {latestReview ? (
                                        <p>
                                            <strong>Last review:</strong> {formatAction(latestReview.action)}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="recommendation-actions">
                                    <button
                                        className="approve-action"
                                        disabled={savingKey === key}
                                        type="button"
                                        onClick={() => submitReview(item)}
                                    >
                                        {savingKey === key ? "Saving..." : "Submit"}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}

export default GovernancePage;
