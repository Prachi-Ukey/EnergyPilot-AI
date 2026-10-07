"""
Energy Consumption Prediction using RandomForestRegressor.

Why RandomForest?
- Handles non-linear relationships between features (hour, temperature, occupancy)
- Robust to outliers (important since we have anomaly data)
- Easy to understand and explain in an interview
- Good performance without complex hyperparameter tuning

Features used:
- hour: Time of day affects consumption (working hours vs after hours)
- day_of_week: Weekdays have higher consumption than weekends
- month: Seasonal temperature variations affect HVAC load
- temperature: Higher temps = more cooling needed
- occupancy: More people = more equipment and lighting usage
- is_weekend: Binary flag for weekend/weekday
- is_after_hours: Binary flag for outside 9AM-6PM

Target: energy_consumption (kWh)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import logging

logger = logging.getLogger(__name__)

# Global model instance - trained once and reused
_prediction_model = None
_model_metrics = {}

def get_feature_columns():
    """Features used for prediction."""
    return ['hour', 'day_of_week', 'month', 'temperature', 'occupancy', 'is_weekend', 'is_after_hours']

def train_prediction_model(df: pd.DataFrame):
    """
    Train RandomForest model on historical energy data.
    Returns the trained model.
    """
    global _prediction_model, _model_metrics
    
    feature_cols = get_feature_columns()
    
    # Drop rows with missing feature values
    df_clean = df[feature_cols + ['energy_consumption']].dropna()
    
    if len(df_clean) < 50:
        logger.warning("Insufficient data for reliable prediction model training")
        return None
    
    X = df_clean[feature_cols]
    y = df_clean['energy_consumption']
    
    # Split: 80% training, 20% testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # RandomForest with reasonable settings for a portfolio project
    model = RandomForestRegressor(
        n_estimators=100,      # 100 decision trees
        max_depth=10,          # Limit depth to avoid overfitting
        min_samples_split=5,
        random_state=42,
        n_jobs=-1              # Use all CPU cores
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model performance
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    _model_metrics = {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "r2": round(r2, 4),
        "training_samples": len(X_train),
        "test_samples": len(X_test)
    }
    
    logger.info(f"Prediction model trained | MAE: {mae:.2f} kWh | RMSE: {rmse:.2f} kWh | R²: {r2:.4f}")
    
    _prediction_model = model
    return model

def predict_consumption(hour: int, day_of_week: int, month: int,
                        temperature: float, occupancy: int,
                        is_weekend: bool, is_after_hours: bool) -> dict:
    """
    Predict energy consumption for given conditions.
    Returns predicted value in kWh.
    """
    global _prediction_model
    
    if _prediction_model is None:
        return {"error": "Model not trained yet. Please upload data first."}
    
    features = np.array([[
        hour, day_of_week, month, temperature, occupancy,
        int(is_weekend), int(is_after_hours)
    ]])
    
    predicted = _prediction_model.predict(features)[0]
    
    return {
        "predicted_consumption": round(float(predicted), 2),
        "unit": "kWh",
        "input_features": {
            "hour": hour,
            "day_of_week": day_of_week,
            "month": month,
            "temperature": temperature,
            "occupancy": occupancy,
            "is_weekend": is_weekend,
            "is_after_hours": is_after_hours
        }
    }

def get_model_metrics() -> dict:
    """Return model performance metrics."""
    return _model_metrics

def is_model_trained() -> bool:
    """Check if prediction model is ready."""
    return _prediction_model is not None
