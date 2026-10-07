import React from 'react'

export default function TopBar({ onMenuToggle }) {
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
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            A
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
        </div>
      </div>
    </header>
  )
}
