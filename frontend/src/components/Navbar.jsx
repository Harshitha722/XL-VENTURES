import { Link } from "react-router-dom";

function Navbar() {

    return (

        <aside className="sidebar">

            <Link className="sidebar-brand" to="/" aria-label="Go to DecisionMesh AI home">
                <span className="sidebar-brand-mark">DM</span>
                <span>DecisionMesh AI</span>
            </Link>

            <div className="sidebar-links">

                <Link to="/">Home</Link>

                <Link to="/dashboard">Dashboard</Link>

                <Link to="/upload">Upload</Link>

                <Link to="/planner">Planner</Link>

                <Link to="/analysis">Analysis</Link>

                <Link to="/scenario-analysis">Scenario Analysis</Link>

                <Link to="/devils-advocate">Devil's Advocate</Link>

                <Link to="/recommendations">Recommendations</Link>

                <Link to="/governance">Governance</Link>

                <Link to="/memory">Memory</Link>

                <Link to="/audit">Audit</Link>

                <Link to="/architecture">Architecture</Link>

                <Link to="/metrics">Metrics</Link>

                <Link to="/knowledge">Knowledge</Link>

                <Link to="/login" className="logout-link">Logout</Link>

            </div>

        </aside>
    );
}

export default Navbar;
