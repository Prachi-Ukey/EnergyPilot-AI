import React, { useState, useEffect } from 'react'
import { energyApi } from '../services/api'
import { AlertTriangle, Clock, Users, Thermometer } from 'lucide-react'

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await energyApi.getAnomalies()
        setAnomalies(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnomalies()
  }, [])

  if (loading) return <div className="flex h-full items-center justify-center">Loading anomalies...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Detected Anomalies</h1>
      
      <div className="grid gap-4">
        {anomalies.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
            No anomalies detected.
          </div>
        ) : (
          anomalies.map((anomaly, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-red-100 flex flex-col md:flex-row gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                    Unusual Consumption Spike
                    {anomaly.is_after_hours && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">After Hours</span>
                    )}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{new Date(anomaly.timestamp).toLocaleString()}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Consumption</p>
                      <p className="font-semibold text-slate-700">{anomaly.energy_consumption} kWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3"/> Occupancy</p>
                      <p className="font-semibold text-slate-700">{anomaly.occupancy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1"><Thermometer className="w-3 h-3"/> Temp</p>
                      <p className="font-semibold text-slate-700">{anomaly.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider text-red-500">Anomaly Score</p>
                      <p className="font-semibold text-red-600">{anomaly.anomaly_score.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
