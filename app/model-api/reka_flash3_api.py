import modal
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Global variables for model and tokenizer
model = None
tokenizer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global model, tokenizer
    model, tokenizer = load_model.remote()
    yield
    # Shutdown
    model = None
    tokenizer = None

# Create Modal app
app = modal.App("reka-flash3-api")

# Define input model
class GenerateRequest(BaseModel):
    prompt: str
    max_length: Optional[int] = 100
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9
    num_return_sequences: Optional[int] = 1

# Define response model
class GenerateResponse(BaseModel):
    generated_text: str
    model_name: str
    parameters: dict

# Create Modal image with dependencies
image = modal.Image.debian_slim().pip_install(
    "torch==2.2.0",
    "transformers==4.37.2",
    "fastapi==0.109.2",
    "uvicorn==0.27.1",
    "python-dotenv==1.0.1"
)

# Create FastAPI app with lifespan
web_app = FastAPI(
    title="Reka Flash 3 API",
    description="API for text generation using Reka Flash 3 model",
    version="1.0.0",
    lifespan=lifespan
)

@app.function(
    image=image,
    gpu="A10G",
    timeout=600
)
def load_model():
    try:
        model_name = "reka-ai/reka-flash-3"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        return model, tokenizer
    except Exception as e:
        raise RuntimeError(f"Failed to load model: {str(e)}")

@web_app.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    try:
        if model is None or tokenizer is None:
            raise HTTPException(status_code=503, detail="Model is not loaded yet")

        # Input validation
        if not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        if request.max_length < 1:
            raise HTTPException(status_code=400, detail="max_length must be greater than 0")
        if not 0 <= request.temperature <= 1:
            raise HTTPException(status_code=400, detail="temperature must be between 0 and 1")
        if not 0 <= request.top_p <= 1:
            raise HTTPException(status_code=400, detail="top_p must be between 0 and 1")
        if request.num_return_sequences < 1:
            raise HTTPException(status_code=400, detail="num_return_sequences must be greater than 0")

        # Generate text
        inputs = tokenizer(request.prompt, return_tensors="pt").to(model.device)
        outputs = model.generate(
            **inputs,
            max_length=request.max_length,
            temperature=request.temperature,
            top_p=request.top_p,
            num_return_sequences=request.num_return_sequences,
            pad_token_id=tokenizer.eos_token_id
        )
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        return GenerateResponse(
            generated_text=generated_text,
            model_name="reka-ai/reka-flash-3",
            parameters={
                "max_length": request.max_length,
                "temperature": request.temperature,
                "top_p": request.top_p,
                "num_return_sequences": request.num_return_sequences
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@web_app.get("/health")
async def health_check():
    return {
        "status": "healthy" if model is not None else "loading",
        "model": "reka-ai/reka-flash-3"
    }

# Create Modal web endpoint
@app.serve()
def fastapi_app():
    return web_app
