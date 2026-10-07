from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.ml.prediction import predict_consumption, get_model_metrics, is_model_trained
from pydantic import BaseModel

router = APIRouter()

class PredictionRequest(BaseModel):
    hour: int
    day_of_week: int
    month: int
    temperature: float
    occupancy: int
    is_weekend: bool
    is_after_hours: bool

@router.get("")
def get_prediction_metrics():
    if not is_model_trained():
        return {"error": "Model not trained. Please upload data first."}
    return get_model_metrics()

@router.post("")
def make_prediction(request: PredictionRequest):
    if not is_model_trained():
        raise HTTPException(status_code=400, detail="Model not trained.")
        
    result = predict_consumption(
        hour=request.hour,
        day_of_week=request.day_of_week,
        month=request.month,
        temperature=request.temperature,
        occupancy=request.occupancy,
        is_weekend=request.is_weekend,
        is_after_hours=request.is_after_hours
    )
    return result
