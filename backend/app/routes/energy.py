from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.data_service import get_hourly_trends, get_daily_trends
from app.database.models import EnergyReading
from app.ml.anomaly_detection import detect_anomalies, train_anomaly_model
from app.ml.prediction import train_prediction_model
import pandas as pd
import io

router = APIRouter()

@router.get("")
def get_all_energy(limit: int = 1000, db: Session = Depends(get_db)):
    readings = db.query(EnergyReading).order_by(EnergyReading.timestamp.desc()).limit(limit).all()
    return readings

@router.get("/hourly")
def get_hourly(db: Session = Depends(get_db)):
    return get_hourly_trends(db)

@router.get("/daily")
def get_daily(db: Session = Depends(get_db)):
    return get_daily_trends(db)

@router.post("/upload")
async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        
        required_columns = ["timestamp", "building", "temperature", "occupancy", "energy_consumption"]
        for col in required_columns:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing required column: {col}")
                
        # Process dates and flags
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['month'] = df['timestamp'].dt.month
        df['is_weekend'] = df['day_of_week'] >= 5
        df['is_after_hours'] = ~df['hour'].between(9, 17)
        
        # Train & detect anomalies
        anomaly_model = train_anomaly_model(df)
        if anomaly_model:
            df = detect_anomalies(df)
        else:
            df['is_anomaly'] = False
            df['anomaly_score'] = 0.0
            
        train_prediction_model(df)
        
        # Clear existing data (for demo purposes)
        db.query(EnergyReading).delete()
        
        # Insert new records
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
        
        return {"status": "success", "message": f"Successfully uploaded and processed {len(records)} records"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
