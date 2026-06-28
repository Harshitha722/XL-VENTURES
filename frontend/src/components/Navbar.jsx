import { Link } from "react-router-dom";

function Navbar() {

    return (

        <nav className="navbar">

            <h2>RenewAI</h2>

            <div>

                <Link to="/">Dashboard</Link>

                <Link to="/upload">Upload</Link>

                <Link to="/planner">Planner</Link>

                <Link to="/analysis">Analysis</Link>

                <Link to="/recommendations">
                    Recommendations
                </Link>

                <Link to="/memory">
                    Memory
                </Link>

                <Link to="/architecture">
                    Architecture
                </Link>

                <Link to="/metrics">
                    Metrics
                </Link>

                <Link to="/knowledge">
                    Knowledge
                </Link>

            </div>

        </nav>
    );
}


export default Navbar;
