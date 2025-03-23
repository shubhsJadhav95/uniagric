from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, firestore, initialize_app, storage
from pydantic import BaseModel
import requests
import os
from typing import Optional, List
from datetime import datetime
import json

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
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/farmer/upload-document")
async def upload_document(farmer_id: str, file: UploadFile = File(...)):
    try:
        # Upload file to Firebase Storage
        blob = bucket.blob(f"farmer_documents/{farmer_id}/{file.filename}")
        content = await file.read()
        blob.upload_from_string(content, content_type=file.content_type)
        
        # Get the public URL
        blob.make_public()
        file_url = blob.public_url

        # Update Firestore document with file reference
        db.collection("farmers").document(farmer_id).update({
            "documents": firestore.ArrayUnion([{
                "filename": file.filename,
                "url": file_url,
                "upload_date": datetime.now().isoformat()
            }])
        })

        return {"status": "success", "file_url": file_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/farmer/{farmer_id}")
async def get_farmer(farmer_id: str):
    try:
        doc = db.collection("farmers").document(farmer_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Farmer not found")
        return doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def assess_risk(farmer_data: dict) -> dict:
    try:
        # Call Reka AI API
        response = requests.post(
            "https://api.reka.ai/analyze",
            json={"farmer_data": farmer_data},
            headers={"Authorization": f"Bearer {REKA_API_KEY}"}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            # Fallback risk assessment if API fails
            return {
                "risk_level": "Medium",
                "risk_score": 0.5,
                "assessment_reason": "Default assessment due to API unavailability"
            }
    except Exception as e:
        # Fallback risk assessment if API fails
        return {
            "risk_level": "Medium",
            "risk_score": 0.5,
            "assessment_reason": f"Default assessment due to error: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 