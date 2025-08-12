"""
Seed initial data for Galo Logistics database
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from server import CompanyStats, Testimonial, FAQ
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_company_stats():
    """Seed company statistics"""
    stats = CompanyStats(
        team_members="25+",
        years_experience="5+",
        on_time_delivery="99.2%",
        customer_rating="4.9★",
        daily_packages="200+",
        daily_miles="150+",
        service_days="7"
    )
    
    # Check if stats already exist
    existing_stats = await db.company_stats.find_one()
    if not existing_stats:
        await db.company_stats.insert_one(stats.dict())
        print("✅ Company stats seeded")
    else:
        print("ℹ️  Company stats already exist")

async def seed_testimonials():
    """Seed testimonials"""
    testimonials_data = [
        {
            "name": "Maria Rodriguez",
            "location": "Boca Raton, FL",
            "quote": "Galo Logistics always delivers on time and with a smile. Best DSP in South Florida!",
            "rating": 5
        },
        {
            "name": "James Thompson", 
            "location": "West Palm Beach, FL",
            "quote": "Professional, reliable, and truly care about the community they serve.",
            "rating": 5
        },
        {
            "name": "Sarah Chen",
            "location": "Delray Beach, FL", 
            "quote": "My packages always arrive safely. You can tell they take pride in their work.",
            "rating": 5
        }
    ]
    
    # Check if testimonials already exist
    existing_count = await db.testimonials.count_documents({})
    if existing_count == 0:
        testimonials = []
        for data in testimonials_data:
            testimonial = Testimonial(**data)
            testimonials.append(testimonial.dict())
        
        await db.testimonials.insert_many(testimonials)
        print(f"✅ {len(testimonials)} testimonials seeded")
    else:
        print(f"ℹ️  {existing_count} testimonials already exist")

async def seed_faqs():
    """Seed FAQ data"""
    faqs_data = [
        {
            "question": "What areas do you service?",
            "answer": "We provide delivery services throughout Palm Beach County, including Boca Raton, Delray Beach, Boynton Beach, Lake Worth, Wellington, and West Palm Beach. If you're unsure if we serve your area, please contact us!",
            "order": 1
        },
        {
            "question": "What are your delivery hours?",
            "answer": "Our delivery window is from 6AM to 9PM, Monday through Sunday. Most deliveries are completed between 10AM and 8PM, but we work extended hours during peak seasons to ensure all packages are delivered on time.",
            "order": 2
        },
        {
            "question": "How can I track my package?",
            "answer": "All packages are tracked through Amazon's tracking system. You'll receive notifications with tracking information when your package is out for delivery. You can also track your package directly through your Amazon account or the Amazon app.",
            "order": 3
        },
        {
            "question": "What if I'm not home for delivery?",
            "answer": "We follow Amazon's delivery protocols. If you're not home, we'll attempt to deliver to a safe location on your property or follow any specific delivery instructions you've provided. For packages requiring a signature, we'll attempt redelivery or leave a notice.",
            "order": 4
        },
        {
            "question": "Do you handle special delivery requests?",
            "answer": "Yes! We accommodate special delivery instructions whenever possible. You can add delivery notes in your Amazon account, or contact us directly for specific requirements. We're committed to making sure your packages are delivered safely and conveniently.",
            "order": 5
        },
        {
            "question": "How do I report an issue with my delivery?",
            "answer": "If you experience any issues with your delivery, please contact us immediately at (561) 555-0123 or email info@galologistics.com. We take all delivery concerns seriously and will work quickly to resolve any problems.",
            "order": 6
        }
    ]
    
    # Check if FAQs already exist
    existing_count = await db.faqs.count_documents({})
    if existing_count == 0:
        faqs = []
        for data in faqs_data:
            faq = FAQ(**data)
            faqs.append(faq.dict())
        
        await db.faqs.insert_many(faqs)
        print(f"✅ {len(faqs)} FAQs seeded")
    else:
        print(f"ℹ️  {existing_count} FAQs already exist")

async def main():
    """Run all seeding functions"""
    print("🌱 Starting database seeding...")
    
    try:
        await seed_company_stats()
        await seed_testimonials()
        await seed_faqs()
        
        print("🎉 Database seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())