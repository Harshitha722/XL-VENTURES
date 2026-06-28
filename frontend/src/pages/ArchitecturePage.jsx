function ArchitecturePage() {
    return (
        <main className="dashboard-shell">
            <section className="intake-header">
                <div>
                    <p className="eyebrow">Decision Intelligence Architecture</p>
                    <h1>Updated Agent Workflow</h1>
                </div>
            </section>

            <section className="analysis-columns">
                <article>
                    <h3>Customer Interaction</h3>
                    <p>Collect customer emails, meetings, contract details, CRM context and historical memory.</p>
                </article>
                <article>
                    <h3>Planner Agent</h3>
                    <p>Determines which specialized context agents should execute and the orchestration plan.</p>
                </article>
                <article>
                    <h3>Context Retrieval Agents</h3>
                    <p>Customer Health, CRM, Contract and Knowledge agents extract structured business context.</p>
                </article>
                <article>
                    <h3>Business Reasoning Agent</h3>
                    <p>Synthesizes risk, opportunity, urgency, and business context for the account.</p>
                </article>
                <article>
                    <h3>Scenario Simulation Agent</h3>
                    <p>Generates multiple outcome scenarios with renewal, churn, revenue, satisfaction and confidence estimates.</p>
                </article>
                <article>
                    <h3>Devil's Advocate Agent</h3>
                    <p>Challenges the top scenario, surfaces hidden risks, and suggests better alternatives.</p>
                </article>
                <article>
                    <h3>Recommendation Agent</h3>
                    <p>Combines reasoning, simulation, and critique to deliver the final next best action.</p>
                </article>
                <article>
                    <h3>Human Review & Memory</h3>
                    <p>Final business review, feedback capture, and memory update for future learning.</p>
                </article>
            </section>
        </main>
    );
}

export default ArchitecturePage;