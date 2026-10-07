import React, { useState, useEffect } from 'react'
import { energyApi } from '../services/api'
import { Zap, Activity, Info } from 'lucide-react'

export default function PredictionsPage() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [prediction, setPrediction] = useState(null)
  
  const [formData, setFormData] = useState({
    hour: 14,
    day_of_week: 2,
    month: 7,
    temperature: 28.5,
    occupancy: 85,
    is_weekend: false,
    is_after_hours: false
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await energyApi.getPrediction()
        setMetrics(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  const handlePredict = async (e) => {
    e.preventDefault()
    try {
      // Create an API post request but wait, prediction uses POST
      // Oh wait, in api.js, getPrediction() is a GET, what about predicting?
      // I'll use fetch directly since api.js might not have post prediction
      const res = await fetch('/api/prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      setPrediction(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value)
    }))
  }

  if (loading) return <div className="flex h-full items-center justify-center">Loading model data...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Energy Predictions</h1>
      
      {metrics && metrics.error ? (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5" />
          <span>Model is not trained yet. Please upload data first to train the Random Forest model.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {metrics && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /> Model Performance
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Mean Absolute Error (MAE)</p>
                    <p className="font-semibold text-slate-800">{metrics.mae} kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Root Mean Squared Error (RMSE)</p>
                    <p className="font-semibold text-slate-800">{metrics.rmse} kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">R² Score</p>
                    <p className="font-semibold text-slate-800">{metrics.r2}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-sm text-slate-500">
                    Trained on {metrics.training_samples} samples using Random Forest Regressor.
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Interactive Prediction Simulator</h2>
              
              <form onSubmit={handlePredict} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hour of Day (0-23)</label>
                    <input type="number" name="hour" value={formData.hour} onChange={handleChange} min="0" max="23" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Temperature (°C)</label>
                    <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} step="0.1" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupancy</label>
                    <input type="number" name="occupancy" value={formData.occupancy} onChange={handleChange} min="0" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Month (1-12)</label>
                    <input type="number" name="month" value={formData.month} onChange={handleChange} min="1" max="12" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_weekend" checked={formData.is_weekend} onChange={handleChange} className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">Is Weekend</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_after_hours" checked={formData.is_after_hours} onChange={handleChange} className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">Is After Hours</span>
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Generate Prediction
                  </button>
                </div>
              </form>
              
              {prediction && (
                <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Predicted Energy Consumption</p>
                      <p className="text-3xl font-bold text-slate-800">
                        {prediction.predicted_consumption} <span className="text-lg font-normal text-slate-500">{prediction.unit}</span>
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Zap className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
