from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Galo Logistics API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models for Galo Logistics
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=1000)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"

class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=1000)

class CompanyStats(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_members: str = "25+"
    years_experience: str = "5+"
    on_time_delivery: str = "99.2%"
    customer_rating: str = "4.9★"
    daily_packages: str = "200+"
    daily_miles: str = "150+"
    service_days: str = "7"
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    quote: str
    rating: int = Field(ge=1, le=5)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FAQ(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Legacy models (keeping for compatibility)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Galo Logistics API - Amazon DSP Partner"}

# Legacy endpoints
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# =================== GALO LOGISTICS API ENDPOINTS ===================

# Contact Form Endpoints
@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact_form(contact_data: ContactSubmissionCreate):
    """Submit a new contact form"""
    try:
        contact_dict = contact_data.dict()
        contact_obj = ContactSubmission(**contact_dict)
        
        # Insert into database
        result = await db.contact_submissions.insert_one(contact_obj.dict())
        
        if result.inserted_id:
            logger.info(f"New contact submission from {contact_obj.email}")
            return contact_obj
        else:
            raise HTTPException(status_code=500, detail="Failed to save contact submission")
            
    except Exception as e:
        logger.error(f"Error submitting contact form: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    """Get all contact submissions (admin endpoint)"""
    try:
        submissions = await db.contact_submissions.find().sort("submitted_at", -1).to_list(1000)
        return [ContactSubmission(**submission) for submission in submissions]
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Company Stats Endpoints
@api_router.get("/stats", response_model=CompanyStats)
async def get_company_stats():
    """Get current company statistics"""
    try:
        # Try to get stats from database
        stats_data = await db.company_stats.find_one()
        
        if stats_data:
            return CompanyStats(**stats_data)
        else:
            # If no stats in database, create default stats
            default_stats = CompanyStats()
            await db.company_stats.insert_one(default_stats.dict())
            return default_stats
            
    except Exception as e:
        logger.error(f"Error fetching company stats: {e}")
        # Return default stats as fallback
        return CompanyStats()

@api_router.put("/stats", response_model=CompanyStats)
async def update_company_stats(stats: CompanyStats):
    """Update company statistics (admin endpoint)"""
    try:
        stats.updated_at = datetime.utcnow()
        
        # Update or insert stats
        result = await db.company_stats.replace_one(
            {},  # Update the single stats document
            stats.dict(),
            upsert=True
        )
        
        if result.acknowledged:
            logger.info("Company stats updated successfully")
            return stats
        else:
            raise HTTPException(status_code=500, detail="Failed to update stats")
            
    except Exception as e:
        logger.error(f"Error updating company stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Testimonials Endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all active testimonials"""
    try:
        testimonials = await db.testimonials.find(
            {"is_active": True}
        ).sort("created_at", -1).to_list(100)
        
        return [Testimonial(**testimonial) for testimonial in testimonials]
        
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        # Return empty list as fallback
        return []

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: Testimonial):
    """Create a new testimonial (admin endpoint)"""
    try:
        result = await db.testimonials.insert_one(testimonial_data.dict())
        
        if result.inserted_id:
            logger.info(f"New testimonial created for {testimonial_data.name}")
            return testimonial_data
        else:
            raise HTTPException(status_code=500, detail="Failed to create testimonial")
            
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# FAQ Endpoints
@api_router.get("/faqs", response_model=List[FAQ])
async def get_faqs():
    """Get all active FAQs ordered by display order"""
    try:
        faqs = await db.faqs.find(
            {"is_active": True}
        ).sort("order", 1).to_list(100)
        
        return [FAQ(**faq) for faq in faqs]
        
    except Exception as e:
        logger.error(f"Error fetching FAQs: {e}")
        # Return empty list as fallback
        return []

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await client.admin.command('ping')
        return {
            "status": "healthy",
            "service": "Galo Logistics API",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
