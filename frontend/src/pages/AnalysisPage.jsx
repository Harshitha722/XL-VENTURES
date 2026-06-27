import { useEffect, useState } from "react";
import api from "../services/api";

function AnalysisPage() {
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        async function fetchLatestAnalysis() {
            const response =
                await api.get("/latest-analysis");

            setAnalysis(response.data);
        }

        fetchLatestAnalysis();
    }, []);

    const reasoning = analysis?.reasoning;

    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Business Reasoning Agent</p>
                    <h1>Analysis</h1>
                </div>
            </section>

            {!reasoning ? (
                <section className="result-panel empty-state">
                    <p>Upload documents to generate analysis.</p>
                </section>
            ) : (
                <section className="analysis-columns">
                    <div>
                        <h3>Risks</h3>
                        <ul>
                            {reasoning.risks.map((risk) => (
                                <li key={risk}>{risk}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3>Opportunities</h3>
                        <ul>
                            {reasoning.opportunities.map((opportunity) => (
                                <li key={opportunity}>{opportunity}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3>Missing Information</h3>
                        <ul>
                            {reasoning.missingInformation.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </main>
    );
}

export default AnalysisPage;
