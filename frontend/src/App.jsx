import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EnergyAnalytics from './pages/EnergyAnalytics.jsx'
import AnomaliesPage from './pages/AnomaliesPage.jsx'
import RecommendationsPage from './pages/RecommendationsPage.jsx'
import DataUploadPage from './pages/DataUploadPage.jsx'
import PredictionsPage from './pages/PredictionsPage.jsx'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<EnergyAnalytics />} />
              <Route path="/anomalies" element={<AnomaliesPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/predictions" element={<PredictionsPage />} />
              <Route path="/upload" element={<DataUploadPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}
