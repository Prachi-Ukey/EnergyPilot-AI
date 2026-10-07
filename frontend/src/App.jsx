import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EnergyAnalytics from './pages/EnergyAnalytics.jsx'
import AnomaliesPage from './pages/AnomaliesPage.jsx'
import RecommendationsPage from './pages/RecommendationsPage.jsx'
import DataUploadPage from './pages/DataUploadPage.jsx'
import PredictionsPage from './pages/PredictionsPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><ProtectedLayout><Dashboard /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><ProtectedLayout><EnergyAnalytics /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/anomalies" element={<ProtectedRoute><ProtectedLayout><AnomaliesPage /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><ProtectedLayout><RecommendationsPage /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><ProtectedLayout><PredictionsPage /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><ProtectedLayout><DataUploadPage /></ProtectedLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
