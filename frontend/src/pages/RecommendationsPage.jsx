import React, { useState, useEffect } from 'react'
import { energyApi } from '../services/api'
import { Lightbulb, TrendingDown, ArrowRight } from 'lucide-react'

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await energyApi.getRecommendations()
        setRecommendations(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecs()
  }, [])

  if (loading) return <div className="flex h-full items-center justify-center">Loading recommendations...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Energy Saving Recommendations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.length === 0 ? (
          <div className="col-span-full bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
            No specific recommendations at this time.
          </div>
        ) : (
          recommendations.map((rec, idx) => {
            const isHigh = rec.severity === 'high'
            const isNominal = rec.severity === 'low' && rec.title === 'All systems nominal'
            
            return (
              <div key={idx} className={`bg-white p-6 rounded-xl shadow-sm border ${isHigh ? 'border-amber-200' : isNominal ? 'border-emerald-200' : 'border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isHigh ? 'bg-amber-100 text-amber-600' : 
                    isNominal ? 'bg-emerald-100 text-emerald-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-800 text-lg">{rec.title}</h3>
                      {rec.severity && !isNominal && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          rec.severity === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {rec.severity}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-4">{rec.description}</p>
                    
                    {!isNominal && rec.potential_saving && (
                      <div className="bg-emerald-50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <TrendingDown className="w-5 h-5" />
                          <span className="font-semibold">Potential Savings</span>
                        </div>
                        <span className="font-bold text-emerald-700">{rec.potential_saving}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
