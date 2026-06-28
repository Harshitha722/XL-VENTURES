import { useEffect, useState } from "react";
import api from "../services/api";

function RecommendationsPage() {

    const [analysis, setAnalysis] =
        useState(null);

    const [approved, setApproved] =
        useState({});

    const [saving, setSaving] =
        useState({});

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function fetchLatestAnalysis() {

            const response =
                await api.get(
                    "/latest-analysis"
                );

            setAnalysis(
                response.data
            );
        }

        fetchLatestAnalysis();

    }, []);


    async function approveRecommendation(item) {

        setError("");

        setSaving((current) => ({
            ...current,
            [item.recommendation]: true
        }));


        try {

            await api.post(
                "/memory/approve-recommendation",
                {
                    analysisTimestamp:
                        analysis.timestamp,

                    recommendation:
                        item.recommendation,

                    priority:
                        item.priority,

                    reason:
                        item.reason,

                    confidence:
                        item.confidence,

                    evidence:
                        item.evidence || []
                }
            );


            setApproved((current) => ({
                ...current,
                [item.recommendation]: true
            }));
        }

        catch (requestError) {

            const status =
                requestError.response?.status;

            const message =
                requestError.response?.data?.error;


            setError(

                status === 404

                    ? "Approval route not found. Restart the backend server and try again."

                    : message ||
                    "Unable to save approval to memory."
            );
        }

        finally {

            setSaving((current) => ({
                ...current,
                [item.recommendation]: false
            }));
        }
    }


    const explanations =
        analysis?.explanations || [];


    return (

        <main className="dashboard-shell">

            <section className="intake-header">

                <div>

                    <p className="eyebrow">
                        Explanation Agent
                    </p>

                    <h1>
                        Recommendations
                    </h1>

                </div>

            </section>


            {error && (

                <div className="error-banner">
                    {error}
                </div>
            )}


            {!analysis?.timestamp ? (

                <section
                    className="result-panel empty-state"
                >

                    <p>
                        Upload documents to generate recommendations.
                    </p>

                </section>

            ) : (

                <section
                    className="recommendation-list"
                >

                    {explanations.map((item) => {

                        const isApproved =
                            Boolean(
                                approved[item.recommendation]
                            );

                        const isSaving =
                            Boolean(
                                saving[item.recommendation]
                            );


                        const isMissingDataAction =

                            item.recommendation.includes(
                                "Collect"
                            ) ||

                            item.recommendation.includes(
                                "Request"
                            ) ||

                            item.recommendation.includes(
                                "Verify"
                            ) ||

                            item.recommendation.includes(
                                "Identify"
                            ) ||

                            item.recommendation.includes(
                                "Survey"
                            );


                        return (

                            <article
                                key={item.recommendation}
                            >

                                <div>

                                    <span
                                        className={`priority ${item.priority.toLowerCase()}`}
                                    >

                                        {item.priority}

                                    </span>


                                    {isMissingDataAction && (

                                        <span
                                            className="missing-data-tag"
                                        >

                                            Missing Data

                                        </span>
                                    )}


                                    <h4>
                                        {item.recommendation}
                                    </h4>


                                    <p>
                                        {item.reason}
                                    </p>


                                    {item.evidence?.length > 0 && (

                                        <ul
                                            className="evidence-list"
                                        >

                                            {item.evidence.map(
                                                (evidence) => (

                                                    <li key={evidence}>
                                                        {evidence}
                                                    </li>
                                                )
                                            )}

                                        </ul>
                                    )}

                                </div>


                                <div
                                    className="recommendation-actions"
                                >

                                    <strong>
                                        {item.confidence}%
                                    </strong>


                                    <button

                                        className="approve-action"

                                        disabled={
                                            isApproved ||
                                            isSaving
                                        }

                                        onClick={() =>
                                            approveRecommendation(item)
                                        }

                                        type="button"
                                    >

                                        {

                                            isApproved

                                                ? "Approved"

                                                : isSaving

                                                    ? "Saving..."

                                                    : "Approve"
                                        }

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

export default RecommendationsPage;
