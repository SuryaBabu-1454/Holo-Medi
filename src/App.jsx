import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SkinDisease from "./pages/SkinDisease";
import XRayDetection from "./pages/XRayDetection";
import DrugDetails from "./pages/DrugDetails";
import BMICalculator from "./pages/BMICalculator";
import Sidebar from "./components/Sidebar";
import Bottombar from "./components/Bottombar";
import Chatbox from "./pages/Chatbox";
import ViewBookmarks from "./components/ViewBookmarks";
import HistoryPage from "./components/HistoryPage";
import EyeDetection from "./pages/EyeDetection";
import MediFinder from "./pages/MediFinder";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen w-full">
        <ToastContainer />
        {/* Sidebar (Visible on larger screens, hidden on small screens) */}
        <div className="hidden md:block md:w-56 text-white h-full">
          <Sidebar />
        </div>

        {/* Main Content Area (Full width on small screens) */}
        <div className="flex-1 h-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skin-sense" element={<SkinDisease />} />
            <Route path="/xray-insight" element={<XRayDetection />} />
            <Route path="/drugInfo-hub" element={<DrugDetails />} />
            <Route path="/health-index" element={<BMICalculator />} />
            <Route path="medi-talk" element={<Chatbox />} />
            <Route path="/bookmarks" element={<ViewBookmarks />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/vision-check" element={<EyeDetection />} />
            <Route path="/medi-finder" element={<MediFinder />} />
          </Routes>
        </div>

        {/* Bottombar (Visible on small screens, hidden on larger screens) */}
        <div className="fixed bottom-0 w-full  z-50 md:hidden bg-gray-900 text-white">
          <Bottombar />
        </div>
      </div>
    </Router >
  );
};

export default App;
