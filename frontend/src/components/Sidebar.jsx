import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Upload,
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Energy Analytics' },
  { to: '/anomalies', icon: AlertTriangle, label: 'Anomalies' },
  { to: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { to: '/predictions', icon: Zap, label: 'Predictions' },
  { to: '/upload', icon: Upload, label: 'Data Upload' },
]

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-slate-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className={`flex items-center gap-2 overflow-hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 w-0'
        } transition-all duration-300`}>
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">EnergyPilot AI</div>
            <div className="text-xs text-slate-400">Smart Energy</div>
          </div>
        </div>
        {!isOpen && (
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-slate-700 transition-colors flex-shrink-0"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
            title={!isOpen ? label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
              }`}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      <div className={`p-4 border-t border-slate-700 ${
        isOpen ? '' : 'flex justify-center'
      }`}>
        {isOpen ? (
          <div>
            <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">System Status</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">System Online</span>
            </div>
          </div>
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" title="System Online" />
        )}
      </div>
    </aside>
  )
}
