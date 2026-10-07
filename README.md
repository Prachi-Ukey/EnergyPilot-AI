# ⚡ EnergyPilot AI

## AI-Powered Smart Energy Optimization Platform

React FastAPI PostgreSQL Scikit-learn Docker Render

EnergyPilot AI is a full-stack AI-powered energy intelligence platform that analyzes electricity consumption data, detects unusual usage patterns, predicts future energy consumption, and generates actionable recommendations to reduce energy waste.

Built with a React frontend and Python FastAPI backend, the platform combines machine learning, data analytics, PostgreSQL, authentication, and interactive visualizations into a production-ready application.

---

## 🚀 Live Demo

**Frontend:**  
https://energypilot-ai-frontend.onrender.com

**Backend:**  
https://energypilot-ai.onrender.com

**Backend Health:**  
https://energypilot-ai.onrender.com/api/health

> **Note on Render Free Tier:** The frontend and backend are deployed on Render's free tier. If the backend has been inactive, the service may take some time to wake up before responding to the first request.

---

# 📌 Overview

Energy consumption data contains valuable information about how buildings use electricity throughout the day. However, manually identifying inefficient usage, abnormal consumption, and potential savings opportunities can be difficult.

EnergyPilot AI addresses this problem by bringing energy analytics, machine learning, prediction, anomaly detection, and recommendations into a single dashboard.

The platform helps answer questions such as:

- How much energy is being consumed?
- When does energy consumption increase?
- Which consumption patterns are unusual?
- Is energy being consumed during low-occupancy or after-hours periods?
- What energy consumption can be expected under specific conditions?
- What actions could help reduce energy waste?

---

# ✨ Key Features

### 📊 Smart Energy Dashboard

Centralized dashboard displaying:

- Total energy consumption
- Average daily usage
- Detected anomalies
- Potential energy savings
- Hourly consumption patterns
- System health status

### 📈 Energy Analytics

Interactive analytics for understanding historical energy usage through:

- Daily consumption trends
- Hourly consumption patterns
- Historical energy readings
- Consumption statistics
- Time-based analysis

### 🔍 AI Anomaly Detection

Uses **Isolation Forest** to identify unusual energy-consumption behavior.

The model analyzes factors including:

- Energy consumption
- Temperature
- Occupancy
- Hour of day
- After-hours usage
- Weekend usage

Detected anomalies are scored and displayed for further investigation.

### 🔮 Energy Consumption Prediction

Uses a **Random Forest Regressor** to predict energy consumption based on:

- Hour
- Day of week
- Month
- Temperature
- Occupancy
- Weekend status
- After-hours status

Users can interactively enter conditions and generate a custom energy-consumption prediction.

### 💡 Smart Recommendations

A recommendation engine converts energy patterns into actionable suggestions.

Examples include:

- Reducing high after-hours consumption
- Investigating weekend energy spikes
- Optimizing temperature settings
- Investigating unusual equipment behavior
- Improving occupancy-based energy management

### 📁 CSV Data Processing

Users can upload historical energy data through the dashboard.

Required columns:

```text
timestamp
building
temperature
occupancy
energy_consumption