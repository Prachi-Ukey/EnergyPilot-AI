import React from 'react';
import { Zap, BarChart3, Leaf } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 font-sans selection:bg-teal-500/30">
      
      {/* LEFT SIDE - BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-16 xl:p-24 bg-slate-900 border-r border-white/5">
        
        {/* Abstract Background Visuals */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Subtle Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
          
          {/* SVG Grid / Energy Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>

          {/* Floating animated particles or rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-teal-500/10 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-teal-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
        </div>

        {/* Branding Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">EnergyPilot AI</span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg mt-16 mb-auto">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Smart Energy.<br/>Smarter Decisions.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-12">
            Monitor energy consumption, detect unusual usage patterns, predict future demand, and discover opportunities to reduce energy waste.
          </p>

          {/* Features */}
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="mt-1 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200">AI-Powered Predictions</h3>
                <p className="text-slate-400 mt-1">Detect future energy consumption patterns with advanced machine learning.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="mt-1 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Smart Analytics</h3>
                <p className="text-slate-400 mt-1">Understand energy usage across time, buildings, and operational hours.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="mt-1 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Energy Optimization</h3>
                <p className="text-slate-400 mt-1">Identify waste and discover actionable energy-saving opportunities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} EnergyPilot AI. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-hidden">
        {/* Subtle mobile background glows */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Branding Header */}
          <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EnergyPilot AI</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
