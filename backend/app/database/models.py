from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database.connection import Base
from datetime import datetime

class EnergyReading(Base):
    __tablename__ = "energy_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    building = Column(String(100), nullable=False, default="Main Building")
    temperature = Column(Float, nullable=True)
    occupancy = Column(Integer, nullable=True, default=0)
    energy_consumption = Column(Float, nullable=False)
    is_weekend = Column(Boolean, default=False)
    is_after_hours = Column(Boolean, default=False)
    hour = Column(Integer, nullable=True)
    day_of_week = Column(Integer, nullable=True)
    month = Column(Integer, nullable=True)
    anomaly_score = Column(Float, nullable=True)
    is_anomaly = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
