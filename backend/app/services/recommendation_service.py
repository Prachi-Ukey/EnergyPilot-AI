from sqlalchemy.orm import Session
from app.database.models import EnergyReading

def generate_recommendations(db: Session):
    recommendations = []
    
    # Check after-hours usage
    after_hours_anomalies = db.query(EnergyReading).filter(
        EnergyReading.is_anomaly == True,
        EnergyReading.is_after_hours == True
    ).count()
    
    if after_hours_anomalies > 5:
        recommendations.append({
            "title": "High After-Hours Consumption",
            "description": "Consider scheduling HVAC and lighting shutdown after working hours. Repeated after-hours consumption detected.",
            "severity": "high",
            "potential_saving": f"{after_hours_anomalies * 5} kWh/month"
        })
        
    # Check low occupancy high usage
    low_occ_high_usage = db.query(EnergyReading).filter(
        EnergyReading.occupancy < 10,
        EnergyReading.energy_consumption > 50
    ).count()
    
    if low_occ_high_usage > 10:
        recommendations.append({
            "title": "Inefficient Low-Occupancy Usage",
            "description": "Energy usage is high relative to occupancy. Check HVAC, lighting, or idle equipment.",
            "severity": "medium",
            "potential_saving": "15% reduction"
        })
        
    # Weekend usage
    weekend_anomalies = db.query(EnergyReading).filter(
        EnergyReading.is_anomaly == True,
        EnergyReading.is_weekend == True
    ).count()
    
    if weekend_anomalies > 3:
        recommendations.append({
            "title": "Unusual Weekend Usage",
            "description": "Weekend energy usage is higher than expected. Review non-essential equipment.",
            "severity": "medium",
            "potential_saving": "100 kWh/month"
        })
        
    if not recommendations:
        recommendations.append({
            "title": "All systems nominal",
            "description": "Your energy consumption is well-optimized. Keep it up!",
            "severity": "low",
            "potential_saving": "0 kWh"
        })
        
    return recommendations
