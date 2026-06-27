import { useState } from "react";
import api from "../services/api";

function UploadPage() {
    const [contractFile, setContractFile] = useState(null);
    const [meetingFile, setMeetingFile] = useState(null);
    const [emailFile, setEmailFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleAnalyze(event) {
        event.preventDefault();
        setError("");
        setResult(null);
        setIsLoading(true);

        try {
            const formData = new FormData();

            if (contractFile) {
                formData.append("contractFile", contractFile);
            }

            if (meetingFile) {
                formData.append("meetingFile", meetingFile);
            }

            if (emailFile) {
                formData.append("emailFile", emailFile);
            }

            const response =
                await api.post("/upload/analyze", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

            setResult(response.data);
        }
        catch (requestError) {
            setError(
                requestError.response?.data?.error ||
                    "Unable to analyze uploaded documents."
            );
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="intake-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Milestone 1</p>
                    <h1>Dynamic Document Intelligence Pipeline</h1>
                </div>

                <div className="status-panel">
                    <span className="status-dot" />
                    <span>Upload-driven agents</span>
                </div>
            </section>

            <section className="workspace-grid">
                <form className="intake-panel" onSubmit={handleAnalyze}>
                    <div className="field-group">
                        <label htmlFor="contractFile">Contract PDF</label>
                        <input
                            id="contractFile"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={(event) =>
                                setContractFile(event.target.files?.[0] || null)
                            }
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="meetingFile">Meeting TXT</label>
                        <input
                            id="meetingFile"
                            type="file"
                            accept="text/plain,.txt"
                            onChange={(event) =>
                                setMeetingFile(event.target.files?.[0] || null)
                            }
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="emailFile">Email TXT</label>
                        <input
                            id="emailFile"
                            type="file"
                            accept="text/plain,.txt"
                            onChange={(event) =>
                                setEmailFile(event.target.files?.[0] || null)
                            }
                        />
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <button className="primary-action" type="submit" disabled={isLoading}>
                        {isLoading ? "Analyzing Documents..." : "Analyze Documents"}
                    </button>
                </form>

                <section className="result-panel">
                    {!result ? (
                        <div className="empty-state">
                            <p className="eyebrow">Waiting for documents</p>
                            <h2>Upload any combination of contract, meeting, and email files.</h2>
                        </div>
                    ) : (
                        <>
                            <div className="result-summary">
                                <div>
                                    <p className="eyebrow">Latest analysis saved</p>
                                    <h2>{result.executionPlan.length} agents executed</h2>
                                </div>

                                <div className="agent-pills">
                                    {result.executionPlan.map((agent) => (
                                        <span key={agent}>{agent}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="metric-grid">
                                <article>
                                    <span>Adoption</span>
                                    <strong>
                                        {result.agentOutputs.CustomerHealthAgent?.adoption ?? "-"}
                                    </strong>
                                </article>
                                <article>
                                    <span>NPS</span>
                                    <strong>
                                        {result.agentOutputs.CustomerHealthAgent?.nps ?? "-"}
                                    </strong>
                                </article>
                                <article>
                                    <span>Renewal</span>
                                    <strong>
                                        {result.agentOutputs.ContractAgent?.renewalDate ?? "-"}
                                    </strong>
                                </article>
                                <article>
                                    <span>Recommendations</span>
                                    <strong>{result.recommendations.length}</strong>
                                </article>
                            </div>

                            <div className="recommendation-list">
                                <h3>Recommended Actions</h3>
                                {result.explanations.map((item) => (
                                    <article key={item.recommendation}>
                                        <div>
                                            <span
                                                className={`priority ${item.priority.toLowerCase()}`}
                                            >
                                                {item.priority}
                                            </span>
                                            <h4>{item.recommendation}</h4>
                                            <p>{item.reason}</p>
                                        </div>
                                        <strong>{item.confidence}%</strong>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </section>
        </main>
    );
}

export default UploadPage;
