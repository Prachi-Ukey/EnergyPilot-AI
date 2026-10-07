from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from app.database.connection import engine, Base, get_db
from app.config import get_settings
from app.services.seed_service import seed_database_if_empty
from app.routes import dashboard, energy, anomalies, prediction, recommendations

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        # We need to make sure the seed file is accessible. Inside docker it's at /data/energy_consumption.csv
        import os
        seed_path = "/data/energy_consumption.csv" if os.path.exists("/data") else "../data/energy_consumption.csv"
        seed_database_if_empty(db, seed_path)
    finally:
        db.close()
    
    yield
    # Shutdown
    pass

app = FastAPI(title="EnergyPilot AI", lifespan=lifespan)

# Setup CORS
origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(energy.router, prefix="/api/energy", tags=["Energy"])
app.include_router(anomalies.router, prefix="/api/anomalies", tags=["Anomalies"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["Prediction"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])

@app.get("/api/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        print("Health check failed:", str(e))
        raise HTTPException(status_code=503, detail="Database connection failed")
