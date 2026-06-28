import { useEffect, useState } from "react";
import api from "../services/api";

function DashboardPage() {

    const [analysis, setAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        async function fetchLatestAnalysis() {

            try {

                const response =
                    await api.get(
                        "/latest-analysis"
                    );

                setAnalysis(
                    response.data
                );
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

                <h1>
                    Dashboard
                </h1>

                <p>
                    Loading latest analysis...
                </p>

            </main>
        );
    }


    if (!analysis?.timestamp) {

        return (

            <main className="page empty-page">

                <h1>
                    Dashboard
                </h1>

                <p>
                    Upload documents to generate the first analysis.
                </p>

            </main>
        );
    }


    const health =
        analysis.agentOutputs
            .CustomerHealthAgent || {};

    const contract =
        analysis.agentOutputs
            .ContractAgent || {};

    const crm =
        analysis.agentOutputs
            .CRMContextAgent || {};

    const completeness =
        analysis.reasoning
            ?.dataCompleteness || {};

    const domainDetection =
        analysis.domainDetection || {};

    const topRecommendations =
        analysis.recommendations
            .slice(0, 5);


    return (

        <main className="dashboard-shell">

            <section className="intake-header">

                <div>

                    <p className="eyebrow">
                        Latest Analysis
                    </p>

                    <h1>

                        {crm.tier
                            ? `${crm.tier} Customer`
                            : "Document Dashboard"}

                    </h1>

                </div>


                <div className="status-panel">

                    <span className="status-dot" />

                    <span>

                        {
                            analysis.recommendations.length
                        }

                        {" "}
                        recommendations

                    </span>

                </div>

            </section>


            <section
                className="metric-grid dashboard-metrics"
            >

                <article>

                    <span>
                        Domain
                    </span>

                    <strong>

                        {
                            domainDetection.domain || "-"
                        }

                    </strong>

                </article>


                <article>

                    <span>
                        Domain Confidence
                    </span>

                    <strong>

                        {
                            domainDetection.confidence ?? 0
                        }%

                    </strong>

                </article>


                <article>

                    <span>
                        Risks
                    </span>

                    <strong>

                        {
                            analysis.reasoning
                                .risks.length
                        }

                    </strong>

                </article>


                <article>

                    <span>
                        Data Confidence
                    </span>

                    <strong>

                        {
                            completeness.confidence ?? 0
                        }%

                    </strong>

                </article>


                <article>

                    <span>
                        Missing Fields
                    </span>

                    <strong>

                        {
                            completeness.missing
                                ?.length || 0
                        }

                    </strong>

                </article>


                <article>

                    <span>
                        Renewal Date
                    </span>

                    <strong>

                        {
                            contract.renewalDate || "-"
                        }

                    </strong>

                </article>


                <article>

                    <span>
                        Contract Value
                    </span>

                    <strong>

                        {
                            contract.contractValue
                                ? `$${contract.contractValue.toLocaleString()}`
                                : "-"
                        }

                    </strong>

                </article>


                <article>

                    <span>
                        Adoption
                    </span>

                    <strong>

                        {
                            health.adoption ?? "-"
                        }

                    </strong>

                </article>


                <article>

                    <span>
                        NPS
                    </span>

                    <strong>

                        {
                            health.nps ?? "-"
                        }

                    </strong>

                </article>


                <article>

                    <span>
                        Recommendations
                    </span>

                    <strong>

                        {
                            analysis.recommendations.length
                        }

                    </strong>

                </article>

            </section>


            <section
                className="analysis-columns dashboard-lists"
            >

                <div>

                    <h3>
                        Risks
                    </h3>

                    {

                        analysis.reasoning.risks.length === 0

                            ? (
                                <p>
                                    No risks detected.
                                </p>
                            )

                            : (

                                <ul>

                                    {
                                        analysis.reasoning.risks.map(
                                            (risk) => (

                                                <li key={risk}>
                                                    {risk}
                                                </li>
                                            )
                                        )
                                    }

                                </ul>
                            )
                    }

                </div>


                <div>

                    <h3>
                        Missing Information
                    </h3>

                    {

                        analysis.reasoning
                            .missingInformation
                            .length === 0

                            ? (
                                <p>
                                    No missing information.
                                </p>
                            )

                            : (

                                <ul>

                                    {
                                        analysis.reasoning
                                            .missingInformation
                                            .map(
                                                (item) => (

                                                    <li key={item}>
                                                        {item}
                                                    </li>
                                                )
                                            )
                                    }

                                </ul>
                            )
                    }

                </div>


                <div>

                    <h3>
                        Top Recommendations
                    </h3>

                    <ul>

                        {
                            topRecommendations.map(
                                (item) => (

                                    <li key={item.action}>

                                        <strong>
                                            {item.priority}
                                        </strong>

                                        {" : "}

                                        {item.action}

                                    </li>
                                )
                            )
                        }

                    </ul>

                </div>

            </section>

        </main>
    );
}

export default DashboardPage;
