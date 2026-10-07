from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.recommendation_service import generate_recommendations

router = APIRouter()

@router.get("")
def get_recommendations(db: Session = Depends(get_db)):
    return generate_recommendations(db)
