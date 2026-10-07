# ⚡ EnergyPilot AI

### Smart Energy Optimization & Intelligence Platform

EnergyPilot AI is a full-stack AI-powered energy analytics platform that helps organizations understand electricity consumption, detect unusual usage patterns, predict energy consumption, and generate actionable recommendations for reducing energy waste.

It combines **machine learning, data analytics, REST APIs, PostgreSQL, and an interactive React dashboard** into a production-style application.

---

## 🌐 Live Demo

### Frontend
https://energypilot-ai-frontend.onrender.com

### Backend API
https://energypilot-ai.onrender.com

### API Health Check
https://energypilot-ai.onrender.com/api/health

---

## 🎯 Problem Statement

Commercial buildings and organizations generate large amounts of energy-consumption data, but identifying waste and unusual usage manually can be difficult.

EnergyPilot AI analyzes historical energy data and answers questions such as:

- How much energy is being consumed?
- When does energy consumption increase?
- Which usage patterns are unusual?
- How much energy could potentially be saved?
- What actions can reduce unnecessary consumption?
- What energy consumption can be expected under specific conditions?

---

# 🚀 Key Features

### 📊 Interactive Energy Dashboard
Provides an overview of energy consumption through:

- Total energy consumption
- Average daily usage
- Detected anomalies
- Potential energy savings
- Hourly consumption patterns
- System status

### 📈 Energy Analytics

Analyze energy consumption across different time periods using interactive charts.

The analytics module provides:

- Daily consumption trends
- Hourly consumption patterns
- Historical energy usage
- Consumption statistics

### 🔍 AI-Based Anomaly Detection

Uses **Isolation Forest** to identify unusual energy-consumption patterns.

The model considers factors such as:

- Energy consumption
- Temperature
- Occupancy
- Hour of day
- After-hours usage
- Weekend usage

Detected anomalies are displayed through the dashboard for further investigation.

### 🔮 Energy Consumption Prediction

Uses a **Random Forest Regressor** to estimate energy consumption based on input conditions.

Prediction inputs include:

- Hour
- Day of week
- Month
- Temperature
- Occupancy
- Weekend status
- After-hours status

The application also displays model-performance metrics such as:

- MAE
- RMSE
- R² score
- Training sample count

### 💡 Smart Recommendations

A rule-based recommendation engine analyzes energy patterns and generates actionable suggestions.

Examples include:

- Reduce high after-hours consumption
- Investigate unusual weekend usage
- Optimize temperature settings
- Investigate equipment-related anomalies
- Improve occupancy-based energy management

### 📁 CSV Data Upload

Users can upload historical energy-consumption data in CSV format.

Required columns:

```text
timestamp
building
temperature
occupancy
energy_consumption