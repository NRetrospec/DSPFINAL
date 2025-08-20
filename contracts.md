# Galo Logistics Amazon DSP Website - Backend Integration Contracts

## Overview
This document outlines the API contracts, database models, and integration approach for converting the frontend-only Galo Logistics website to a full-stack application.

## Current Mock Data (to be replaced)
Located in `/app/frontend/src/data/mock.js`:
- Company information and stats
- Gallery items and testimonials  
- FAQ data
- Contact form submissions (currently client-side only)

## Database Models Required

### 1. ContactSubmission
```python
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"  # new, reviewed, responded
```

### 2. CompanyStats
```python
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
```

### 3. Testimonial
```python
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    quote: str
    rating: int = Field(ge=1, le=5)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 4. FAQ
```python
class FAQ(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## API Endpoints Required

### Contact Management
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin)

### Company Data
- `GET /api/stats` - Get company statistics
- `PUT /api/stats` - Update company statistics (admin)

### Testimonials
- `GET /api/testimonials` - Get active testimonials
- `POST /api/testimonials` - Add new testimonial (admin)

### FAQ Management
- `GET /api/faqs` - Get active FAQs ordered by display order

## Frontend Integration Changes

### 1. ContactSection.jsx
- Replace mock `handleSubmit` with actual API call to `POST /api/contact`
- Add loading state during submission
- Handle success/error responses with proper toast messages
- Add form validation

### 2. AboutSection.jsx  
- Replace hardcoded stats with API call to `GET /api/stats`
- Add loading skeleton for stats cards
- Handle API errors gracefully

### 3. GallerySection.jsx
- Replace mock testimonials with API call to `GET /api/testimonials`
- Add loading state for testimonials section
- Handle empty testimonials gracefully

### 4. ContactSection.jsx (FAQ)
- Replace mock FAQ data with API call to `GET /api/faqs`
- Add loading state for FAQ accordion
- Handle API errors

## Implementation Priority

### Phase 1: Core Backend Setup
1. Create database models
2. Implement contact form endpoint
3. Add basic error handling
4. Seed initial data (stats, testimonials, FAQs)

### Phase 2: Frontend Integration
1. Replace contact form mock with real API
2. Add loading states and error handling
3. Connect stats, testimonials, and FAQ data
4. Remove mock.js dependencies

### Phase 3: Data Management
1. Add API validation
2. Implement proper error responses
3. Add logging for contact submissions
4. Consider admin endpoints for future expansion

## Error Handling Strategy
- Return consistent error format: `{"error": "message", "details": "..."}`
- Frontend should show user-friendly messages
- Log all errors server-side for debugging
- Graceful fallbacks for non-critical data (stats, testimonials)

## Security Considerations
- Validate all input data
- Rate limiting for contact form submissions
- Sanitize user input to prevent XSS
- Add CORS configuration for production

## Testing Approach
- Test contact form submission end-to-end
- Verify all data loads correctly on page refresh
- Test error scenarios (network failures, invalid data)
- Ensure responsive behavior maintained