from sqlalchemy.orm import Session
from app.database.models import EnergyReading
from datetime import datetime, timedelta
from sqlalchemy import func
import pandas as pd

def get_dashboard_summary(db: Session):
    total_records = db.query(EnergyReading).count()
    if total_records == 0:
        return {"error": "No data available"}
    
    total_consumption = db.query(func.sum(EnergyReading.energy_consumption)).scalar() or 0
    first_record = db.query(EnergyReading).order_by(EnergyReading.timestamp.asc()).first()
    last_record = db.query(EnergyReading).order_by(EnergyReading.timestamp.desc()).first()
    
    days = (last_record.timestamp - first_record.timestamp).days if first_record and last_record else 1
    if days == 0: days = 1
    
    avg_daily = total_consumption / days
    
    anomalies = db.query(EnergyReading).filter(EnergyReading.is_anomaly == True).count()
    
    return {
        "total_consumption": round(total_consumption, 2),
        "avg_daily_consumption": round(avg_daily, 2),
        "detected_anomalies": anomalies,
        "potential_savings_kwh": round(anomalies * 2.5, 2),
        "data_days": days
    }

def get_hourly_trends(db: Session):
    results = db.query(
        EnergyReading.hour,
        func.avg(EnergyReading.energy_consumption).label("avg_consumption")
    ).group_by(EnergyReading.hour).order_by(EnergyReading.hour).all()
    
    return [{"hour": r[0], "consumption": round(r[1], 2)} for r in results]

def get_daily_trends(db: Session):
    last_record = db.query(EnergyReading).order_by(EnergyReading.timestamp.desc()).first()
    if not last_record:
        return []
        
    start_date = last_record.timestamp - timedelta(days=30)
    
    results = db.query(
        func.date(EnergyReading.timestamp).label("date"),
        func.sum(EnergyReading.energy_consumption).label("total_consumption")
    ).filter(EnergyReading.timestamp >= start_date).group_by(func.date(EnergyReading.timestamp)).order_by(func.date(EnergyReading.timestamp)).all()
    
    return [{"date": str(r[0]), "consumption": round(r[1], 2)} for r in results]

def get_recent_anomalies(db: Session, limit: int = 10):
    anomalies = db.query(EnergyReading).filter(EnergyReading.is_anomaly == True).order_by(EnergyReading.timestamp.desc()).limit(limit).all()
    
    result = []
    for a in anomalies:
        result.append({
            "id": a.id,
            "timestamp": a.timestamp,
            "building": a.building,
            "energy_consumption": a.energy_consumption,
            "occupancy": a.occupancy,
            "temperature": a.temperature,
            "is_after_hours": a.is_after_hours,
            "anomaly_score": a.anomaly_score
        })
    return result

def load_dataframe_from_db(db: Session):
    records = db.query(EnergyReading).all()
    data = [{
        "timestamp": r.timestamp,
        "building": r.building,
        "temperature": r.temperature,
        "occupancy": r.occupancy,
        "energy_consumption": r.energy_consumption,
        "is_weekend": r.is_weekend,
        "is_after_hours": r.is_after_hours,
        "hour": r.hour,
        "day_of_week": r.day_of_week,
        "month": r.month
    } for r in records]
    
    if not data:
        return pd.DataFrame()
    
    return pd.DataFrame(data)
