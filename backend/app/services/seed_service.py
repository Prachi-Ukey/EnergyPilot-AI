import os
import pandas as pd
from sqlalchemy.orm import Session
from app.database.models import EnergyReading
from app.ml.anomaly_detection import train_anomaly_model, detect_anomalies
from app.ml.prediction import train_prediction_model

def seed_database_if_empty(db: Session, data_path: str = "../../data/energy_consumption.csv"):
    if db.query(EnergyReading).count() > 0:
        print("Database already contains data, skipping seed.")
        df = pd.DataFrame([{
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
        } for r in db.query(EnergyReading).all()])
        train_anomaly_model(df)
        train_prediction_model(df)
        return

    if not os.path.exists(data_path):
        print(f"Seed file {data_path} not found.")
        return
        
    print("Loading data from seed file...")
    df = pd.read_csv(data_path)
    
    # Clean and process
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    df['is_weekend'] = df['day_of_week'] >= 5
    df['is_after_hours'] = ~df['hour'].between(9, 17)
    
    # Train anomaly model to get anomaly scores
    anomaly_model = train_anomaly_model(df)
    if anomaly_model:
        df = detect_anomalies(df)
    else:
        df['is_anomaly'] = False
        df['anomaly_score'] = 0.0
        
    # Train prediction model
    train_prediction_model(df)
        
    # Batch insert to database
    print("Inserting into database...")
    records = []
    for _, row in df.iterrows():
        record = EnergyReading(
            timestamp=row['timestamp'],
            building=row['building'],
            temperature=row['temperature'],
            occupancy=row['occupancy'],
            energy_consumption=row['energy_consumption'],
            is_weekend=row['is_weekend'],
            is_after_hours=row['is_after_hours'],
            hour=row['hour'],
            day_of_week=row['day_of_week'],
            month=row['month'],
            is_anomaly=row.get('is_anomaly', False),
            anomaly_score=row.get('anomaly_score', 0.0)
        )
        records.append(record)
        
    db.bulk_save_objects(records)
    db.commit()
    print("Database seeding completed.")
