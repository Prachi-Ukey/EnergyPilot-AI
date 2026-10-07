import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

np.random.seed(42)

# Generate 90 days of hourly data starting 90 days ago
start_date = datetime.now() - timedelta(days=90)
timestamps = pd.date_range(start=start_date, periods=90*24, freq='h')

records = []
for i, ts in enumerate(timestamps):
    hour = ts.hour
    dow = ts.dayofweek  # 0=Monday, 6=Sunday
    month = ts.month
    is_weekend = dow >= 5
    is_after_hours = not (9 <= hour < 18)
    
    # Temperature: seasonal variation + daily variation
    # Summer months (June-Aug) are hotter
    seasonal_temp = 25 + 8 * np.sin((month - 3) * np.pi / 6)
    daily_temp_variation = -3 * np.cos((hour - 14) * np.pi / 12)  # Peak at 2pm
    temperature = seasonal_temp + daily_temp_variation + np.random.normal(0, 1.5)
    temperature = round(max(10, min(45, temperature)), 1)
    
    # Occupancy: follows working hours pattern
    if is_weekend:
        max_occupancy = 10  # Skeleton crew on weekends
    elif not is_after_hours:
        # Working hours: ramp up in morning, peak midday, down in evening
        if 9 <= hour <= 11:
            max_occupancy = 60 + (hour - 9) * 15  # 60 to 90
        elif 12 <= hour <= 13:
            max_occupancy = 70  # Lunch hour dip
        elif 14 <= hour <= 16:
            max_occupancy = 95  # Peak afternoon
        else:
            max_occupancy = 85
    else:
        max_occupancy = 5  # Security/cleaning staff
    
    occupancy = max(0, int(max_occupancy + np.random.normal(0, 5)))
    
    # Energy consumption
    # Base load: always-on servers, security systems
    base_load = 15.0
    
    if is_weekend:
        if is_after_hours:
            energy = base_load + np.random.normal(2, 1)  # Very low
        else:
            energy = base_load + 8 + np.random.normal(3, 2)  # Weekend day, low
    elif not is_after_hours:
        # Working hours - occupancy and temperature driven
        occupancy_load = occupancy * 0.5  # 0.5 kWh per person
        hvac_load = max(0, (temperature - 22) * 2)  # Extra cooling above 22°C
        energy = base_load + occupancy_load + hvac_load + np.random.normal(10, 5)
    else:
        # After hours on weekdays
        energy = base_load + np.random.normal(3, 2)
    
    energy = round(max(5, energy), 2)
    
    records.append({
        'timestamp': ts.strftime('%Y-%m-%d %H:%M:%S'),
        'building': 'Main Building',
        'temperature': temperature,
        'occupancy': occupancy,
        'energy_consumption': energy
    })

df = pd.DataFrame(records)

# Inject realistic anomalies
# Anomaly 1: HVAC left on overnight - Week 3, Thursday night
for i in range(len(df)):
    ts = pd.to_datetime(df.loc[i, 'timestamp'])
    if ts.dayofweek == 3 and ts.hour in [22, 23, 0, 1] and 14 <= (datetime.now() - timedelta(days=90) + timedelta(hours=i)).timetuple().tm_yday % 30 <= 18:
        df.loc[i, 'energy_consumption'] = round(df.loc[i, 'energy_consumption'] * 4.5, 2)

# Anomaly 2: Weekend equipment left on
for i in range(len(df)):
    ts = pd.to_datetime(df.loc[i, 'timestamp'])
    if ts.dayofweek == 5 and 2 <= ts.hour <= 5 and 20 <= i < 30:
        df.loc[i, 'energy_consumption'] = round(90 + np.random.normal(0, 5), 2)

# Anomaly 3: After-hours spike - equipment malfunction
for i in range(500, 510):
    if i < len(df):
        ts = pd.to_datetime(df.loc[i, 'timestamp'])
        if not (9 <= ts.hour < 18):
            df.loc[i, 'energy_consumption'] = round(85 + np.random.normal(0, 10), 2)

# Anomaly 4: Mid-day unexplained spikes
for idx in [300, 700, 1100, 1500, 1900]:
    if idx < len(df):
        df.loc[idx, 'energy_consumption'] = round(df.loc[idx, 'energy_consumption'] * 3.2, 2)

# Anomaly 5: Night time high usage pattern (last 2 weeks)
for i in range(len(df) - 14*24, len(df)):
    if i >= 0 and i < len(df):
        ts = pd.to_datetime(df.loc[i, 'timestamp'])
        if ts.hour in [23, 0, 1] and i % 3 == 0:
            df.loc[i, 'energy_consumption'] = round(70 + np.random.normal(0, 8), 2)

os.makedirs('data', exist_ok=True)
df.to_csv('data/energy_consumption.csv', index=False)
print(f'Generated {len(df)} rows of energy data')
print(f'Date range: {df["timestamp"].min()} to {df["timestamp"].max()}')
print(f'Energy range: {df["energy_consumption"].min()} to {df["energy_consumption"].max()} kWh')
