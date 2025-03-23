#!/usr/bin/env python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Define paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, 'datasets', 'farm_data.csv')
MODEL_DIR = os.path.join(SCRIPT_DIR, 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'farm_plan_model.joblib')
ENCODER_PATH = os.path.join(MODEL_DIR, 'farm_plan_encoders.joblib')
SCALER_PATH = os.path.join(MODEL_DIR, 'farm_plan_scaler.joblib')

def load_data():
    """Load and prepare dataset for training"""
    logger.info("Loading data from %s", DATA_PATH)
    
    try:
        df = pd.read_csv(DATA_PATH)
        logger.info("Data loaded successfully: %d rows", len(df))
        return df
    except Exception as e:
        logger.error("Error loading data: %s", str(e))
        raise

def preprocess_data(df):
    """Preprocess the data for training"""
    logger.info("Preprocessing data")
    
    # Create copies to avoid warnings
    X = df.drop('approved', axis=1).copy()
    y = df['approved'].copy()
    
    # Initialize encoders dictionary
    label_encoders = {}
    
    # Categorical columns
    cat_cols = ['crop_type', 'soil_type', 'climate']
    
    # Encode categorical variables
    for col in cat_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        label_encoders[col] = le
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Normalize numerical features
    scaler = StandardScaler()
    numerical_cols = ['area_hectares', 'yield_per_hectare']
    
    X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
    X_test[numerical_cols] = scaler.transform(X_test[numerical_cols])
    
    logger.info("Data preprocessing completed")
    return X_train, X_test, y_train, y_test, label_encoders, scaler

def train_model(X_train, y_train, X_test, y_test):
    """Train the Random Forest model"""
    logger.info("Training Random Forest model")
    
    model = RandomForestClassifier(
        n_estimators=100, 
        random_state=42,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    logger.info("Model trained successfully. Accuracy: %.2f%%", accuracy * 100)
    logger.info("\nClassification Report:\n%s", classification_report(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'Feature': X_train.columns,
        'Importance': model.feature_importances_
    }).sort_values('Importance', ascending=False)
    
    logger.info("Feature Importance:\n%s", feature_importance)
    
    return model

def save_model(model, label_encoders, scaler):
    """Save the trained model and preprocessors"""
    # Create model directory if it doesn't exist
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    logger.info("Saving model to %s", MODEL_PATH)
    joblib.dump(model, MODEL_PATH)
    
    logger.info("Saving label encoders to %s", ENCODER_PATH)
    joblib.dump(label_encoders, ENCODER_PATH)
    
    logger.info("Saving scaler to %s", SCALER_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    logger.info("Model and preprocessors saved successfully")

def main():
    """Main function to execute the training process"""
    logger.info("Starting farm plan approval model training")
    
    try:
        # Load data
        df = load_data()
        
        # Preprocess data
        X_train, X_test, y_train, y_test, label_encoders, scaler = preprocess_data(df)
        
        # Train model
        model = train_model(X_train, y_train, X_test, y_test)
        
        # Save model
        save_model(model, label_encoders, scaler)
        
        logger.info("Farm plan approval model training completed successfully")
        
    except Exception as e:
        logger.error("Error in training process: %s", str(e))
        raise

if __name__ == "__main__":
    main() 