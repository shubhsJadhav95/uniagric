from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, firestore, initialize_app, storage
from pydantic import BaseModel
import requests
import os
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # For non-interactive mode
import base64
from io import BytesIO
import seaborn as sns
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="UniAgric API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase initialization
cred = credentials.Certificate("serviceAccountKey.json")
firebase_app = initialize_app(cred, {
    'storageBucket': 'uniagric-2077b.appspot.com'
})
db = firestore.client()
bucket = storage.bucket()

# Reka AI API Key
REKA_API_KEY = "7140d9de8cb2b719363d5f18f7bc68cdab4339a8a2a1ef81b6d2078f24908091"

# Define AI model paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AI_DIR = os.path.join(BASE_DIR, 'app', 'ai')
MODELS_DIR = os.path.join(AI_DIR, 'models')

# Ensure directories exist
os.makedirs(os.path.join(AI_DIR, 'plots'), exist_ok=True)

# Load AI models on startup
@app.on_event("startup")
async def load_models():
    """Load AI models on startup"""
    global farmer_model, farmer_encoders, farmer_scaler
    global farm_plan_model, farm_plan_encoders, farm_plan_scaler
    
    try:
        # Load farmer approval model
        farmer_model_path = os.path.join(MODELS_DIR, 'farmer_approval_model.joblib')
        farmer_encoders_path = os.path.join(MODELS_DIR, 'farmer_label_encoders.joblib')
        farmer_scaler_path = os.path.join(MODELS_DIR, 'farmer_scaler.joblib')
        
        # Check if models exist, otherwise train them
        if not (os.path.exists(farmer_model_path) and 
                os.path.exists(farmer_encoders_path) and
                os.path.exists(farmer_scaler_path)):
            logger.info("Farmer approval model not found. Training models...")
            await train_farmer_model()
        
        # Load farmer model
        farmer_model = joblib.load(farmer_model_path)
        farmer_encoders = joblib.load(farmer_encoders_path)
        farmer_scaler = joblib.load(farmer_scaler_path)
        logger.info("Farmer model loaded successfully")
        
        # Load farm plan model
        farm_plan_model_path = os.path.join(MODELS_DIR, 'farm_plan_model.joblib')
        farm_plan_encoders_path = os.path.join(MODELS_DIR, 'farm_plan_encoders.joblib')
        farm_plan_scaler_path = os.path.join(MODELS_DIR, 'farm_plan_scaler.joblib')
        
        # Check if models exist, otherwise train them
        if not (os.path.exists(farm_plan_model_path) and 
                os.path.exists(farm_plan_encoders_path) and
                os.path.exists(farm_plan_scaler_path)):
            logger.info("Farm plan model not found. Training models...")
            await train_farm_plan_model()
        
        # Load farm plan model
        farm_plan_model = joblib.load(farm_plan_model_path)
        farm_plan_encoders = joblib.load(farm_plan_encoders_path)
        farm_plan_scaler = joblib.load(farm_plan_scaler_path)
        logger.info("Farm plan model loaded successfully")
        
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")

async def train_farmer_model():
    """Train the farmer approval model"""
    import sys
    sys.path.append(AI_DIR)
    
    try:
        # Import the training module
        from app.ai.train_farmer_model import main as train_main
        
        # Train the model
        train_main()
        logger.info("Farmer model training completed")
    except Exception as e:
        logger.error(f"Error training farmer model: {str(e)}")
        raise

async def train_farm_plan_model():
    """Train the farm plan model"""
    import sys
    sys.path.append(AI_DIR)
    
    try:
        # Import the training module
        from app.ai.train_plan_model import main as train_main
        
        # Train the model
        train_main()
        logger.info("Farm plan model training completed")
    except Exception as e:
        logger.error(f"Error training farm plan model: {str(e)}")
        raise

# Pydantic models for request validation
class FarmerPersonalInfo(BaseModel):
    full_name: str
    email: str
    phone_number: str
    id_type: str
    id_number: str

class FarmDetails(BaseModel):
    farm_name: str
    farm_type: str
    ownership_type: str
    farm_location: str
    land_size: float
    years_operation: int
    main_crops: str
    farm_description: str

class FinancialInfo(BaseModel):
    funding_required: float
    funding_purpose: str

class FarmerRegistration(BaseModel):
    personal_info: FarmerPersonalInfo
    farm_details: FarmDetails
    financial_info: FinancialInfo

# AI prediction models
class FarmerPredictionRequest(BaseModel):
    years_experience: float
    land_size_hectares: float
    previous_loans: int
    credit_score: int
    annual_income: float
    crop_diversity: int
    has_irrigation: bool
    farm_type: str

class FarmPlanPredictionRequest(BaseModel):
    crop_type: str
    soil_type: str
    climate: str
    area_hectares: float
    yield_per_hectare: float

class PredictionResponse(BaseModel):
    prediction: bool
    probability: float
    recommendations: List[str]
    visualization_url: Optional[str] = None

@app.post("/api/farmer/register")
async def register_farmer(registration: FarmerRegistration):
    try:
        # Create a new document in Firestore
        farmer_data = {
            "personal_info": registration.personal_info.dict(),
            "farm_details": registration.farm_details.dict(),
            "financial_info": registration.financial_info.dict(),
            "registration_date": datetime.now().isoformat(),
            "status": "pending"
        }

        # Store in Firestore
        doc_ref = db.collection("farmers").document()
        doc_ref.set(farmer_data)

        # Call Reka AI for risk analysis
        risk_assessment = await assess_risk(farmer_data)
        
        # Update the document with risk assessment
        doc_ref.update({
            "risk_level": risk_assessment["risk_level"],
            "risk_score": risk_assessment["risk_score"],
            "assessment_date": datetime.now().isoformat()
        })

        return {
            "status": "success",
            "farmer_id": doc_ref.id,
            "risk_assessment": risk_assessment
        }

    except Exception as e:
        logger.error(f"Error registering farmer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/farmer/upload-document")
async def upload_document(farmer_id: str, file: UploadFile = File(...)):
    try:
        # Upload file to Firebase Storage
        blob = bucket.blob(f"farmer_documents/{farmer_id}/{file.filename}")
        
        # Read file content
        content = await file.read()
        
        # Upload to Firebase
        blob.upload_from_string(
            content,
            content_type=file.content_type
        )
        
        # Make the file publicly accessible
        blob.make_public()
        
        # Get the public URL
        url = blob.public_url
        
        # Update Firestore with document reference
        doc_ref = db.collection("farmers").document(farmer_id)
        
        # Get the current documents array or create it
        farmer_data = doc_ref.get().to_dict()
        documents = farmer_data.get("documents", [])
        
        # Add the new document
        documents.append({
            "name": file.filename,
            "url": url,
            "content_type": file.content_type,
            "upload_date": datetime.now().isoformat()
        })
        
        # Update the document
        doc_ref.update({"documents": documents})
        
        return {
            "status": "success",
            "url": url
        }
        
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/farmer/{farmer_id}")
async def get_farmer(farmer_id: str):
    try:
        doc_ref = db.collection("farmers").document(farmer_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Farmer not found")
            
        return doc.to_dict()
        
    except Exception as e:
        logger.error(f"Error getting farmer data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/farmers")
async def get_all_farmers():
    try:
        farmers = []
        for doc in db.collection("farmers").stream():
            farmer_data = doc.to_dict()
            farmer_data["id"] = doc.id
            farmers.append(farmer_data)
            
        return farmers
        
    except Exception as e:
        logger.error(f"Error getting all farmers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/farmer", response_model=PredictionResponse)
async def predict_farmer_approval(request: FarmerPredictionRequest):
    """Predict farmer loan approval"""
    try:
        # Convert boolean to integer
        has_irrigation = 1 if request.has_irrigation else 0
        
        # Create input dataframe
        input_data = pd.DataFrame({
            'years_experience': [request.years_experience],
            'land_size_hectares': [request.land_size_hectares],
            'previous_loans': [request.previous_loans],
            'credit_score': [request.credit_score],
            'annual_income': [request.annual_income],
            'crop_diversity': [request.crop_diversity],
            'has_irrigation': [has_irrigation],
            'farm_type': [request.farm_type]
        })
        
        # Encode categorical variables
        if 'farm_type' in farmer_encoders:
            try:
                input_data['farm_type'] = farmer_encoders['farm_type'].transform(input_data['farm_type'])
            except ValueError as e:
                farm_types = list(farmer_encoders['farm_type'].classes_)
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid farm type. Valid options are: {', '.join(farm_types)}"
                )
        
        # Scale numerical features
        numerical_cols = ['years_experience', 'land_size_hectares', 'previous_loans', 
                          'credit_score', 'annual_income', 'crop_diversity']
        
        input_data[numerical_cols] = farmer_scaler.transform(input_data[numerical_cols])
        
        # Make prediction
        prediction = bool(farmer_model.predict(input_data)[0])
        probability = float(farmer_model.predict_proba(input_data)[0][1])
        
        # Generate recommendations
        recommendations = []
        original_data = {
            'years_experience': request.years_experience,
            'land_size_hectares': request.land_size_hectares,
            'previous_loans': request.previous_loans,
            'credit_score': request.credit_score,
            'annual_income': request.annual_income,
            'crop_diversity': request.crop_diversity,
            'has_irrigation': has_irrigation,
            'farm_type': request.farm_type
        }
        
        # Generate recommendations based on probability
        if probability < 0.3:
            recommendations.append("Based on the provided information, your profile has a low approval probability.")
            
            # Specific recommendations based on data
            if original_data['credit_score'] < 650:
                recommendations.append("Your credit score is below the recommended threshold. Consider improving it before applying.")
            
            if original_data['years_experience'] < 3:
                recommendations.append("Your farming experience is limited. Consider gaining more experience or partnering with experienced farmers.")
            
            if original_data['has_irrigation'] == 0:
                recommendations.append("Installing irrigation systems can improve your farm's productivity and increase approval chances.")
        
        elif probability < 0.7:
            recommendations.append("Your profile has a moderate approval probability.")
            
            if original_data['credit_score'] < 700:
                recommendations.append("Improving your credit score could increase your approval chances.")
            
            if original_data['crop_diversity'] < 3:
                recommendations.append("Consider diversifying your crops to reduce risk and improve approval probability.")
            
            recommendations.append("With some improvements, your application could have a higher chance of approval.")
        
        else:
            recommendations.append("Your profile has a high approval probability.")
            recommendations.append("Your experience and farm management practices show strong potential for success.")
            
            if original_data['annual_income'] < 50000:
                recommendations.append("While your profile is strong, increasing farm revenue could help secure larger funding amounts.")
        
        # Generate visualization
        # (In a real app, you'd save this to cloud storage and return a URL)
        # For simplicity, we're just creating the visualization and returning the recommendations
        
        return {
            "prediction": prediction,
            "probability": probability,
            "recommendations": recommendations,
            "visualization_url": None  # In a real app, this would be a URL to the visualization
        }
        
    except Exception as e:
        logger.error(f"Error predicting farmer approval: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/farm-plan", response_model=PredictionResponse)
async def predict_farm_plan(request: FarmPlanPredictionRequest):
    """Predict farm plan approval"""
    try:
        # Create input dataframe
        input_data = pd.DataFrame({
            'crop_type': [request.crop_type],
            'soil_type': [request.soil_type],
            'climate': [request.climate],
            'area_hectares': [request.area_hectares],
            'yield_per_hectare': [request.yield_per_hectare]
        })
        
        # Encode categorical variables
        for col, encoder in farm_plan_encoders.items():
            if col in input_data.columns:
                try:
                    input_data[col] = encoder.transform(input_data[col])
                except ValueError:
                    valid_values = list(encoder.classes_)
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Invalid value for {col}. Valid options are: {', '.join(valid_values)}"
                    )
        
        # Scale numerical features
        numerical_cols = ['area_hectares', 'yield_per_hectare']
        input_data[numerical_cols] = farm_plan_scaler.transform(input_data[numerical_cols])
        
        # Make prediction
        prediction = bool(farm_plan_model.predict(input_data)[0])
        probability = float(farm_plan_model.predict_proba(input_data)[0][1])
        
        # Generate recommendations
        recommendations = []
        original_data = {
            'crop_type': request.crop_type,
            'soil_type': request.soil_type,
            'climate': request.climate,
            'area_hectares': request.area_hectares,
            'yield_per_hectare': request.yield_per_hectare
        }
        
        # Generate recommendations based on probability
        if probability < 0.3:
            recommendations.append("Your farm plan has a low approval probability.")
            
            # Provide specific recommendations based on data
            if original_data['yield_per_hectare'] < 3:
                recommendations.append("Consider crops with higher yield potential for your land area.")
            
            if original_data['crop_type'] == 'cotton' and original_data['climate'] == 'arid':
                recommendations.append("Cotton in arid regions often requires extensive irrigation. Consider alternative crops or improved irrigation systems.")
            
            recommendations.append("Review your farm plan and consider consulting with an agricultural extension officer.")
        
        elif probability < 0.7:
            recommendations.append("Your farm plan has a moderate approval probability.")
            
            if original_data['soil_type'] == 'sandy' and original_data['yield_per_hectare'] < 5:
                recommendations.append("Sandy soils often require additional fertility management. Consider soil amendments or alternative crops.")
            
            recommendations.append("With some improvements, your plan could have a higher chance of approval.")
        
        else:
            recommendations.append("Your farm plan has a high approval probability.")
            recommendations.append("Continue with your current approach, which shows strong potential for success.")
        
        return {
            "prediction": prediction,
            "probability": probability,
            "recommendations": recommendations,
            "visualization_url": None  # In a real app, this would be a URL to the visualization
        }
        
    except Exception as e:
        logger.error(f"Error predicting farm plan approval: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def assess_risk(farmer_data: dict) -> dict:
    """Assess risk using Reka AI"""
    try:
        # Convert farmer data to format expected by Reka API
        data_for_assessment = {
            "farmer_name": farmer_data["personal_info"]["full_name"],
            "farm_type": farmer_data["farm_details"]["farm_type"],
            "farm_location": farmer_data["farm_details"]["farm_location"],
            "years_in_operation": farmer_data["farm_details"]["years_operation"],
            "funding_required": farmer_data["financial_info"]["funding_required"],
            "purpose": farmer_data["financial_info"]["funding_purpose"]
        }
        
        # In a production app, we would make a call to an external risk assessment API
        # For this example, we'll simulate it with a simple algorithm
        
        # Calculate risk factors (this is a simplistic example)
        risk_score = 0
        
        # Years in operation factor
        years_op = data_for_assessment["years_in_operation"]
        if years_op < 2:
            risk_score += 40
        elif years_op < 5:
            risk_score += 20
        elif years_op < 10:
            risk_score += 10
        
        # Funding amount factor
        funding = data_for_assessment["funding_required"]
        if funding > 100000:
            risk_score += 30
        elif funding > 50000:
            risk_score += 20
        elif funding > 10000:
            risk_score += 10
        
        # Get final risk score (0-100, higher is riskier)
        final_score = min(risk_score, 100)
        
        # Determine risk level
        if final_score < 30:
            risk_level = "low"
        elif final_score < 70:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        return {
            "risk_level": risk_level,
            "risk_score": final_score,
            "risk_factors": [
                f"Years in operation: {years_op}",
                f"Funding amount: ${funding:,.2f}"
            ]
        }
        
    except Exception as e:
        logger.error(f"Error in risk assessment: {str(e)}")
        return {
            "risk_level": "unknown",
            "risk_score": 50,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 