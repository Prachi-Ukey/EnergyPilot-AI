from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.data_service import get_recent_anomalies
from app.database.models import EnergyReading

router = APIRouter()

@router.get("")
def get_all_anomalies(db: Session = Depends(get_db)):
    return db.query(EnergyReading).filter(EnergyReading.is_anomaly == True).order_by(EnergyReading.timestamp.desc()).all()

@router.get("/recent")
def get_recent(limit: int = 10, db: Session = Depends(get_db)):
    return get_recent_anomalies(db, limit)
