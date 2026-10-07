"""
Anomaly Detection using IsolationForest.

Why IsolationForest?
- Designed specifically for anomaly detection
- Works well with energy data (most readings are normal, few are anomalous)
- Does not require labeled anomaly data for training
- Fast and memory-efficient
- Easy to explain: it 'isolates' unusual data points

How it works:
- Normal readings cluster together (hard to isolate)
- Anomalous readings are isolated with fewer splits (easy to isolate)
- Anomaly score: more negative = more anomalous
- contamination=0.05 means we expect ~5% of readings to be anomalies

Features used for detection:
- energy_consumption: Primary signal
- hour: Context for whether consumption level is appropriate
- occupancy: High energy + low occupancy = suspicious
- temperature: Accounts for weather-driven consumption
- is_after_hours: Critical context for anomaly interpretation
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import logging

logger = logging.getLogger(__name__)

# Global model instance
_anomaly_model = None

def get_anomaly_feature_columns():
    """Features used for anomaly detection."""
    return ['energy_consumption', 'hour', 'occupancy', 'temperature', 'is_after_hours']

def train_anomaly_model(df: pd.DataFrame):
    """
    Train IsolationForest on energy readings.
    contamination=0.05 means ~5% of data points are expected to be anomalies.
    """
    global _anomaly_model
    
    feature_cols = get_anomaly_feature_columns()
    df_clean = df[feature_cols].dropna()
    
    if len(df_clean) < 20:
        logger.warning("Insufficient data for anomaly model training")
        return None
    
    model = IsolationForest(
        contamination=0.05,   # Expect ~5% anomalies
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(df_clean)
    logger.info(f"Anomaly detection model trained on {len(df_clean)} samples")
    
    _anomaly_model = model
    return model

def detect_anomalies(df: pd.DataFrame) -> pd.DataFrame:
    """
    Detect anomalies in energy readings.
    Returns dataframe with is_anomaly and anomaly_score columns added.

    IsolationForest returns:
    -1 = anomaly
     1 = normal
    score: more negative = more anomalous
    """
    global _anomaly_model
    
    if _anomaly_model is None:
        logger.error("Anomaly model not trained")
        df['is_anomaly'] = False
        df['anomaly_score'] = 0.0
        return df
    
    feature_cols = get_anomaly_feature_columns()
    
    # Use available features (some may be missing from uploaded CSV)
    available_cols = [c for c in feature_cols if c in df.columns]
    df_features = df[available_cols].fillna(0)
    
    # Add missing columns with zeros
    for col in feature_cols:
        if col not in df_features.columns:
            df_features[col] = 0
    
    df_features = df_features[feature_cols]
    
    # Predict: -1 = anomaly, 1 = normal
    predictions = _anomaly_model.predict(df_features)
    scores = _anomaly_model.score_samples(df_features)  # Anomaly scores
    
    df = df.copy()
    df['is_anomaly'] = predictions == -1
    df['anomaly_score'] = scores.round(4)
    
    anomaly_count = df['is_anomaly'].sum()
    logger.info(f"Anomaly detection complete: {anomaly_count}/{len(df)} readings flagged")
    
    return df

def is_anomaly_model_trained() -> bool:
    """Check if anomaly model is ready."""
    return _anomaly_model is not None
