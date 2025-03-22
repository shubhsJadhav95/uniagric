# Farmer Registration Backend API

This is a FastAPI backend service that handles farmer registration data and stores it in Firebase Firestore.

## Features

- Farmer registration endpoint
- Fetch all registered farmers
- Fetch specific farmer by ID
- Firebase Firestore integration
- CORS support for frontend communication
- Data validation using Pydantic models

## Prerequisites

- Python 3.8+
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your Firebase credentials:
   - Get your Firebase Admin SDK credentials from the Firebase Console
   - Replace the placeholder values in `.env` with your actual credentials

## Running the Application

1. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

2. The API will be available at `http://localhost:8000`

3. Access the API documentation at:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### POST /register
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

### GET /farmers
Get all registered farmers

### GET /farmers/{farmer_id}
Get a specific farmer by ID

## Deployment

This application can be deployed on various cloud platforms:

1. **Railway**
   - Create a new project
   - Connect your GitHub repository
   - Add environment variables
   - Deploy

2. **Render**
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables
   - Deploy

3. **Fly.io**
   - Install Fly CLI
   - Run `flyctl launch`
   - Add environment variables
   - Deploy with `flyctl deploy`

## Security Considerations

- In production, update CORS settings to only allow your frontend domain
- Keep Firebase credentials secure and never commit them to version control
- Consider implementing rate limiting for API endpoints
- Add authentication middleware for protected routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 