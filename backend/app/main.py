from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Farmer Registration API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL")
})

firebase_admin.initialize_app(cred)
db = firestore.client()

# Pydantic models for request/response
class FarmerBase(BaseModel):
    name: str
    email: str
    phone: str
    id_type: str
    id_number: str
    farm_name: str
    farm_type: str
    ownership_type: str
    farm_location: str
    land_size: float
    years_operation: int
    main_crops: str
    farm_description: str
    funding_required: float
    funding_purpose: str
    monthly_returns: float
    repayment_timeframe: str
    funding_description: str

class FarmerCreate(FarmerBase):
    pass

class Farmer(FarmerBase):
    id: str
    created_at: str
    status: str = "pending"

    class Config:
        from_attributes = True

# API Endpoints
@app.post("/register", response_model=Farmer)
async def register_farmer(farmer: FarmerCreate):
    try:
        # Create a new document in Firestore
        farmer_data = farmer.model_dump()
        farmer_data["created_at"] = firestore.SERVER_TIMESTAMP
        farmer_data["status"] = "pending"
        
        # Add to Firestore
        doc_ref = db.collection("farmers").document()
        doc_ref.set(farmer_data)
        
        # Get the created document
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=500, detail="Failed to create farmer record")
            
        # Return the created farmer data
        farmer_data["id"] = doc.id
        farmer_data["created_at"] = doc.get("created_at").isoformat() if doc.get("created_at") else None
        return farmer_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/farmers", response_model=List[Farmer])
async def get_farmers():
    try:
        # Get all farmers from Firestore
        farmers_ref = db.collection("farmers")
        docs = farmers_ref.stream()
        
        farmers = []
        for doc in docs:
            farmer_data = doc.to_dict()
            farmer_data["id"] = doc.id
            farmer_data["created_at"] = farmer_data.get("created_at").isoformat() if farmer_data.get("created_at") else None
            farmers.append(farmer_data)
            
        return farmers
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/farmers/{farmer_id}", response_model=Farmer)
async def get_farmer(farmer_id: str):
    try:
        # Get specific farmer from Firestore
        doc = db.collection("farmers").document(farmer_id).get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Farmer not found")
            
        farmer_data = doc.to_dict()
        farmer_data["id"] = doc.id
        farmer_data["created_at"] = farmer_data.get("created_at").isoformat() if farmer_data.get("created_at") else None
        return farmer_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 