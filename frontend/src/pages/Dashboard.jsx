import React, { useState, useEffect } from 'react'
import { energyApi } from '../services/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts'
import { Zap, AlertTriangle, TrendingDown, Clock } from 'lucide-react'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [hourly, setHourly] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, hrRes] = await Promise.all([
          energyApi.getDashboardSummary(),
          energyApi.getHourlyAverage()
        ])
        setSummary(sumRes.data)
        setHourly(hrRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>
  }

  if (!summary || summary.error) {
    return <div className="flex h-full items-center justify-center">No data available. Please upload a dataset.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Consumption</p>
              <p className="text-2xl font-bold text-slate-800">{summary.total_consumption.toLocaleString()} <span className="text-base font-normal text-slate-500">kWh</span></p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Daily Usage</p>
              <p className="text-2xl font-bold text-slate-800">{summary.avg_daily_consumption.toLocaleString()} <span className="text-base font-normal text-slate-500">kWh</span></p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Detected Anomalies</p>
              <p className="text-2xl font-bold text-slate-800">{summary.detected_anomalies}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Potential Savings</p>
              <p className="text-2xl font-bold text-slate-800">{summary.potential_savings_kwh} <span className="text-base font-normal text-slate-500">kWh</span></p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Hourly Consumption Pattern</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourly}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorConsumption)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
