# ⚡ EnergyPilot AI

> **AI-powered energy consumption analysis platform** that detects anomalies, predicts future usage, and generates actionable recommendations to reduce energy waste in commercial buildings.

---

## 🌟 Overview

EnergyPilot AI ingests hourly energy consumption data from commercial buildings, runs it through machine learning pipelines (Isolation Forest + Random Forest), and surfaces insights through an interactive dashboard. It answers the key questions:

- **When** is energy being wasted?
- **Why** is consumption spiking?
- **What** should facilities managers do about it?

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📁 **CSV Upload** | Upload historical energy data in seconds |
| 🔍 **Anomaly Detection** | Isolation Forest flags unusual consumption patterns |
| 📈 **Forecasting** | Random Forest predicts next 24h of energy usage |
| 💡 **Recommendations** | Rule-based engine generates prioritized action items |
| 📊 **Interactive Dashboard** | Real-time charts with drill-down capability |
| 🐳 **Docker Ready** | One-command deployment with Docker Compose |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        EnergyPilot AI                           │
│                                                                 │
│  ┌──────────────┐      ┌──────────────────┐      ┌──────────┐  │
│  │   React UI   │◄────►│  FastAPI Backend  │◄────►│ Postgres │  │
│  │  (Vite +     │      │                  │      │   DB     │  │
│  │  Recharts)   │      │  ┌────────────┐  │      └──────────┘  │
│  └──────────────┘      │  │ ML Pipeline│  │                    │
│                        │  │            │  │                    │
│                        │  │ IsoForest  │  │                    │
│                        │  │ RandForest │  │                    │
│                        │  │ Rule Engine│  │                    │
│                        │  └────────────┘  │                    │
│                        └──────────────────┘                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Docker Compose                         │  │
│  │    [postgres:5432]  [backend:8000]  [frontend:5173]      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** — High-performance async REST API
- **SQLAlchemy** — ORM with PostgreSQL
- **scikit-learn** — Isolation Forest & Random Forest ML models
- **pandas / numpy** — Data processing and feature engineering
- **Pydantic** — Data validation and serialization

### Frontend
- **React 18** — Component-based UI
- **Vite** — Lightning-fast dev server and bundler
- **Recharts** — Responsive charting library
- **TailwindCSS** — Utility-first styling
- **Axios** — HTTP client

### Infrastructure
- **PostgreSQL 15** — Primary data store
- **Docker & Docker Compose** — Container orchestration
- **pytest** — Backend testing

---

## 📁 Project Structure

```
EnergyPilot-AI/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── database.py              # DB connection & session
│   │   ├── models/
│   │   │   └── energy.py            # SQLAlchemy ORM models
│   │   ├── schemas/
│   │   │   └── energy.py            # Pydantic schemas
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── upload.py        # CSV upload endpoint
│   │   │       ├── analysis.py      # Analysis endpoints
│   │   │       └── predictions.py   # Prediction endpoints
│   │   ├── services/
│   │   │   ├── data_processor.py    # CSV ingestion & feature engineering
│   │   │   └── recommendation.py   # Rule-based recommendation engine
│   │   └── ml/
│   │       ├── anomaly_detection.py # Isolation Forest
│   │       └── prediction.py        # Random Forest forecasting
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_api.py              # pytest test suite
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx        # Main dashboard layout
│   │   │   ├── EnergyChart.jsx      # Time-series visualization
│   │   │   ├── AnomalyTable.jsx     # Flagged anomalies list
│   │   │   ├── Recommendations.jsx  # Action item cards
│   │   │   └── UploadZone.jsx       # Drag-and-drop CSV upload
│   │   ├── api/
│   │   │   └── client.js            # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── energy_consumption.csv       # Sample 90-day dataset
├── generate_data.py                 # Sample data generator
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🧠 How It Works

### 1. Data Ingestion
Upload a CSV with columns: `timestamp`, `building`, `temperature`, `occupancy`, `energy_consumption`.

The data processor:
- Parses timestamps and validates schema
- Engineers features: `hour`, `day_of_week`, `month`, `is_weekend`, `is_after_hours`
- Persists processed rows to PostgreSQL

### 2. Anomaly Detection (Isolation Forest)
```
Raw Data → Feature Scaling → Isolation Forest → Anomaly Scores → Flagged Records
```
- Trains on: `energy_consumption`, `hour`, `occupancy`, `temperature`, `is_after_hours`
- Contamination factor: 5% (tunable)
- Returns `is_anomaly` flag and `anomaly_score` per record

### 3. Consumption Forecasting (Random Forest)
```
Historical Features → Random Forest Regressor → 24h Predictions
```
- Features: `hour`, `day_of_week`, `month`, `temperature`, `occupancy`, `is_weekend`, `is_after_hours`
- Target: `energy_consumption`
- Trained incrementally as more data is uploaded

### 4. Recommendation Engine
Rule-based system analyzing patterns:

| Pattern | Recommendation | Severity |
|---|---|---|
| High after-hours consumption | Schedule HVAC shutdown | 🔴 High |
| Weekend spikes | Audit weekend equipment | 🔴 High |
| Temperature-correlated waste | Optimize thermostat setpoints | 🟡 Medium |
| Anomaly cluster | Investigate equipment fault | 🟡 Medium |
| Occupancy-energy mismatch | Install occupancy sensors | 🟢 Low |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload energy CSV file |
| `GET` | `/api/analysis/summary` | Get statistical summary |
| `GET` | `/api/analysis/anomalies` | List detected anomalies |
| `GET` | `/api/analysis/timeseries` | Time-series data for charts |
| `GET` | `/api/predictions/next24h` | Predict next 24 hours |
| `POST` | `/api/predictions/custom` | Custom prediction by parameters |
| `GET` | `/api/recommendations` | Get prioritized recommendations |
| `GET` | `/health` | Health check |

---

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed and running
- Ports 5432, 8000, 5173 available

### Quick Start

```bash
# 1. Clone and enter project
git clone <repo-url>
cd EnergyPilot-AI

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker-compose up --build

# 4. Open in browser
# Frontend: http://localhost:5173
# API Docs: http://localhost:8000/docs
```

### Individual Service Control

```bash
# Start only the database
docker-compose up postgres

# Rebuild backend after code changes
docker-compose up --build backend

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (wipe database)
docker-compose down -v
```

---

## 🏃 Running Locally (Without Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Linux/Mac

pip install -r requirements.txt

# Ensure PostgreSQL is running locally, then:
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

### Generate Sample Data

```bash
# From project root
python generate_data.py
# Creates data/energy_consumption.csv with 2160 rows (90 days × 24 hours)
```

### Run Tests

```bash
cd EnergyPilot-AI
pytest backend/tests/ -v
```

---

## 📊 Example Workflow

```
1. Open http://localhost:5173
      │
      ▼
2. Drag & drop data/energy_consumption.csv
      │
      ▼
3. Backend processes CSV → stores to PostgreSQL → trains ML models
      │
      ▼
4. Dashboard populates:
   ├── Time-series chart with anomaly markers
   ├── Statistics cards (total kWh, peak hours, anomaly count)
   ├── Anomaly table with timestamps and severity scores
   └── Recommendations panel with actionable insights
      │
      ▼
5. Use Predict panel → enter future conditions → get 24h forecast
```

---

## 🔮 Future Improvements

- [ ] **Multi-building support** — Compare energy profiles across facilities
- [ ] **Real-time streaming** — WebSocket integration for live meter data
- [ ] **Alert system** — Email/SMS notifications when anomalies are detected
- [ ] **Cost modeling** — Map kWh consumption to utility billing rates
- [ ] **LSTM forecasting** — Deep learning for long-range predictions
- [ ] **Carbon footprint** — CO₂ equivalent tracking and reporting
- [ ] **Export reports** — PDF/Excel energy audit reports
- [ ] **Auth & RBAC** — Multi-tenant support with role-based access

---

## 👩‍💻 Author

**EnergyPilot AI** — Built as a full-stack AI/ML showcase project demonstrating:
- Production-ready FastAPI architecture
- scikit-learn ML pipeline integration
- React dashboard with real-time data visualization
- Docker Compose microservices deployment

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
