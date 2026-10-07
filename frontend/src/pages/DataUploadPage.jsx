import React, { useState } from 'react'
import { energyApi } from '../services/api'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function DataUploadPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setResult(null)
    
    try {
      const res = await energyApi.uploadCSV(file)
      setResult({ type: 'success', message: res.data.message })
      setFile(null)
    } catch (err) {
      setResult({ 
        type: 'error', 
        message: err.response?.data?.detail || 'An error occurred during upload.' 
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Data Upload</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Upload Energy Data (CSV)</h2>
          <p className="text-slate-500">Upload historical energy consumption data to train models and generate insights. Required columns: timestamp, building, temperature, occupancy, energy_consumption.</p>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            id="file-upload" 
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
            {file ? (
              <>
                <FileText className="w-12 h-12 text-blue-500 mb-3" />
                <span className="font-medium text-slate-700">{file.name}</span>
                <span className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</span>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="font-medium text-blue-600 hover:text-blue-700">Click to browse</span>
                <span className="text-sm text-slate-500 mt-1">or drag and drop CSV file here</span>
              </>
            )}
          </label>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
            result.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {result.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{result.message}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              !file || uploading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
            }`}
          >
            {uploading ? 'Processing...' : 'Upload and Process'}
          </button>
        </div>
      </div>
    </div>
  )
}
