import React, { useState, useEffect } from 'react'
import { energyApi } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function EnergyAnalytics() {
  const [dailyData, setDailyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await energyApi.getDailyConsumption(30)
        setDailyData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex h-full items-center justify-center">Loading analytics...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Energy Analytics</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Daily Consumption (Last 30 Days)</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
