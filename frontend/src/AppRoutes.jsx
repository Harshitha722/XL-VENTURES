import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import PlannerPage from "./pages/PlannerPage";
import AnalysisPage from "./pages/AnalysisPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MemoryPage from "./pages/MemoryPage";
import ArchitecturePage from "./pages/ArchitecturePage";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Navbar />

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

            </Routes>

        </BrowserRouter>
    );
}


export default AppRoutes;