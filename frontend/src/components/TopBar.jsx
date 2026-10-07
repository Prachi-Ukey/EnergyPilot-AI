import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="text-slate-500 hover:text-slate-700 md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-slate-800">Overview</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-700">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-500">{user?.role || 'Energy Analyst'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
