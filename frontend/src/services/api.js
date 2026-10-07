import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const energyApi = {
  // Health
  getHealth: () => api.get('/health'),

  // Dashboard
  getDashboardSummary: () => api.get('/dashboard/summary'),

  // Energy readings
  getEnergyReadings: (days = 7) => api.get(`/energy?days=${days}`),
  getDailyConsumption: (days = 30) => api.get(`/energy/daily?days=${days}`),
  getHourlyAverage: (days = 30) => api.get(`/energy/hourly?days=${days}`),

  // Upload
  uploadCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/energy/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Anomalies
  getAnomalies: (days = 30) => api.get(`/anomalies?days=${days}`),
  getRecentAnomalies: (limit = 10) => api.get(`/anomalies/recent?limit=${limit}`),
  getAnomalySummary: () => api.get('/anomalies/summary'),

  // Prediction
  getPrediction: () => api.get('/prediction'),
  getNext24HourPrediction: () => api.get('/prediction/next24hours'),

  // Recommendations
  getRecommendations: () => api.get('/recommendations'),
}

export default api
