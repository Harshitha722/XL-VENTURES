import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import PlannerPage from "./pages/PlannerPage";
import AnalysisPage from "./pages/AnalysisPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MemoryPage from "./pages/MemoryPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import ScenarioAnalysisPage from "./pages/ScenarioAnalysisPage";
import DevilsAdvocatePage from "./pages/DevilsAdvocatePage";
import MetricsPage from "./pages/MetricsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";

function AppLayout() {
    const location = useLocation();
    const isLanding = location.pathname === "/";
    const isAuth = location.pathname === "/login";

    return (
        <div className="app-shell">
            {!isLanding && !isAuth && <Navbar />}
            <main className={`app-main ${isLanding || isAuth ? "landing-main" : ""}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/planner" element={<PlannerPage />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="/scenario-analysis" element={<ScenarioAnalysisPage />} />
                    <Route path="/devils-advocate" element={<DevilsAdvocatePage />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                    <Route path="/memory" element={<MemoryPage />} />
                    <Route path="/architecture" element={<ArchitecturePage />} />
                    <Route path="/metrics" element={<MetricsPage />} />
                    <Route path="/knowledge" element={<KnowledgeBasePage />} />
                </Routes>
            </main>
        </div>
    );
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}

export default AppRoutes;
