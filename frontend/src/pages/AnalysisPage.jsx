import { useEffect, useState } from "react";
import api from "../services/api";

function AnalysisPage() {

    const [analysis, setAnalysis] =
        useState(null);

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


    const reasoning =
        analysis?.reasoning;

    const completeness =
        reasoning?.dataCompleteness;


    return (

        <main className="dashboard-shell">

            <section className="intake-header">

                <div>

                    <p className="eyebrow">
                        Business Reasoning Agent
                    </p>

                    <h1>
                        Analysis
                    </h1>

                </div>

            </section>


            {!reasoning ? (

                <section
                    className="result-panel empty-state"
                >

                    <p>
                        Upload documents to generate analysis.
                    </p>

                </section>

            ) : (

                <section
                    className="analysis-columns"
                >

                    {/* RISKS */}

                    <div>

                        <h3>
                            Risks
                        </h3>

                        {
                            reasoning.risks.length === 0
                                ? (
                                    <p>
                                        No risks detected.
                                    </p>
                                )
                                : (
                                    <ul>

                                        {reasoning.risks.map(
                                            (risk) => (

                                                <li key={risk}>
                                                    {risk}
                                                </li>
                                            )
                                        )}

                                    </ul>
                                )
                        }

                    </div>


                    {/* OPPORTUNITIES */}

                    <div>

                        <h3>
                            Opportunities
                        </h3>

                        {
                            reasoning.opportunities.length === 0
                                ? (
                                    <p>
                                        No opportunities detected.
                                    </p>
                                )
                                : (
                                    <ul>

                                        {reasoning.opportunities.map(
                                            (opportunity) => (

                                                <li key={opportunity}>
                                                    {opportunity}
                                                </li>
                                            )
                                        )}

                                    </ul>
                                )
                        }

                    </div>


                    {/* MISSING INFORMATION */}

                    <div>

                        <h3>
                            Missing Information
                        </h3>

                        {
                            reasoning.missingInformation.length === 0
                                ? (
                                    <p>
                                        No missing information.
                                    </p>
                                )
                                : (
                                    <ul>

                                        {reasoning.missingInformation.map(
                                            (item) => (

                                                <li key={item}>
                                                    {item}
                                                </li>
                                            )
                                        )}

                                    </ul>
                                )
                        }

                    </div>


                    {/* DATA COMPLETENESS AGENT */}

                    {completeness && (

                        <div>

                            <h3>
                                Data Completeness
                            </h3>

                            <p>

                                Confidence:

                                <strong>
                                    {" "}
                                    {completeness.confidence}%
                                </strong>

                            </p>


                            <h4>
                                Available Data
                            </h4>

                            {
                                completeness.available.length === 0
                                    ? (
                                        <p>
                                            No available data detected.
                                        </p>
                                    )
                                    : (
                                        <ul>

                                            {completeness.available.map(
                                                (item) => (

                                                    <li key={item}>
                                                        ✓ {item}
                                                    </li>
                                                )
                                            )}

                                        </ul>
                                    )
                            }


                            <h4>
                                Missing Data
                            </h4>

                            {
                                completeness.missing.length === 0
                                    ? (
                                        <p>
                                            No missing fields.
                                        </p>
                                    )
                                    : (
                                        <ul>

                                            {completeness.missing.map(
                                                (item) => (

                                                    <li key={item}>
                                                        ✗ {item}
                                                    </li>
                                                )
                                            )}

                                        </ul>
                                    )
                            }

                        </div>
                    )}

                </section>
            )}

        </main>
    );
}

export default AnalysisPage;