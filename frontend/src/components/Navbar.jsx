import { Link } from "react-router-dom";

function Navbar() {

    return (

        <aside className="sidebar">

            <h2>RenewAI</h2>

            <div className="sidebar-links">

                <Link to="/">Dashboard</Link>

                <Link to="/dashboard">Dashboard</Link>

                <Link to="/upload">Upload</Link>

                <Link to="/planner">Planner</Link>

                <Link to="/analysis">Analysis</Link>

                <Link to="/recommendations">Recommendations</Link>

                <Link to="/memory">Memory</Link>

                <Link to="/metrics">Metrics</Link>

                <Link to="/knowledge">Knowledge</Link>

            </div>

        </aside>
    );
}

export default Navbar;
