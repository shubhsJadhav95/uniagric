# UniAgric Backend API

This is the backend API for the UniAgric platform, built with FastAPI and Firebase. It handles farmer registration, document management, and risk assessment.

## Features

- Farmer registration with data validation
- Document upload to Firebase Storage
- Risk assessment using Reka AI
- Firebase Firestore integration
- RESTful API endpoints
- CORS support for frontend communication
- Data validation using Pydantic models

## Prerequisites

- Python 3.8+
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials
- Reka AI API key

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Firebase Setup:
   - Download your Firebase service account key from the Firebase Console
   - Save it as `serviceAccountKey.json` in the backend directory

4. Environment Variables:
   Create a `.env` file with:
   ```
   REKA_API_KEY=your_reka_api_key
   FIREBASE_CREDENTIALS_PATH=path_to_serviceAccountKey.json
   ```

## Running the Application

Development:
```bash
uvicorn main:app --reload
```

Production:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API Documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### POST /api/farmer/register
Register a new farmer
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "id_type": "passport",
  "id_number": "123456789",
  "farm_name": "Green Acres",
  "farm_type": "crop",
  "ownership_type": "sole-proprietor",
  "farm_location": "123 Farm Road",
  "land_size": 10.5,
  "years_operation": 5,
  "main_crops": "Wheat, Corn",
  "farm_description": "Organic farm specializing in wheat and corn",
  "funding_required": 50000.0,
  "funding_purpose": "expansion",
  "monthly_returns": 8000.0,
  "repayment_timeframe": "12-24",
  "funding_description": "Expanding farm operations"
}
```

### POST /api/farmer/upload-document
Upload documents for a registered farmer.

### GET /api/farmer/{farmer_id}
Get farmer details by ID.

### GET /api/farmers
Get all registered farmers.

## Deployment

### Option 1: Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Option 2: Railway
1. Create a new project
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Option 3: Google Cloud Run
1. Build and push Docker image
2. Deploy to Cloud Run
3. Set environment variables

## Security Considerations

- CORS is configured to allow requests from your frontend domain
- Firebase Authentication is used for secure access
- API keys and credentials are stored in environment variables
- File uploads are validated and stored securely
- Rate limiting implemented for API endpoints
- Protected routes use authentication middleware

## Testing

Run tests with:
```bash
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
