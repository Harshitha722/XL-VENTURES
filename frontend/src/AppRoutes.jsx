import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import PlannerPage from "./pages/PlannerPage";
import AnalysisPage from "./pages/AnalysisPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MemoryPage from "./pages/MemoryPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import MetricsPage from "./pages/MetricsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";


function AppRoutes() {

    return (

        <BrowserRouter>

            <div className="app-shell">
                <Navbar />
                <main className="app-main">
                    <Routes>

                        <Route
                            path="/"
                            element={<DashboardPage />}
                        />

                        <Route
                            path="/upload"
                            element={<UploadPage />}
                        />

                        <Route
                            path="/planner"
                            element={<PlannerPage />}
                        />

                        <Route
                            path="/analysis"
                            element={<AnalysisPage />}
                        />

                        <Route
                            path="/recommendations"
                            element={<RecommendationsPage />}
                        />

                        <Route
                            path="/memory"
                            element={<MemoryPage />}
                        />

                        <Route
                            path="/architecture"
                            element={<ArchitecturePage />}
                        />

                        <Route
                            path="/metrics"
                            element={<MetricsPage />}
                        />

                        <Route
                            path="/knowledge"
                            element={<KnowledgeBasePage />}
                        />

                    </Routes>
                </main>
            </div>

        </BrowserRouter>
    );
}


export default AppRoutes;
