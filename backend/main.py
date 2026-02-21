"""
SmartTravelAI — FastAPI Backend
An AI-powered travel planning REST API with mock data.
Provides endpoints for destinations, trip generation, recommendations, and chatbot.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import uuid4
import random

# ──────────────────────────────────────────────
#  App Setup
# ──────────────────────────────────────────────

app = FastAPI(
    title="SmartTravelAI API",
    description="AI-powered travel planner backend — plan, explore, and optimize your trips.",
    version="1.0.0",
)

# Allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
#  Models
# ──────────────────────────────────────────────

class TripRequest(BaseModel):
    """User preferences for generating a personalized trip."""
    destination: str = Field(..., min_length=1)
    budget: str = Field(default="medium", pattern="^(budget|medium|luxury)$")
    duration: int = Field(default=3, ge=1, le=14)
    interests: list[str] = Field(default=["culture", "food"])
    travelers: int = Field(default=1, ge=1, le=10)

class ChatMessage(BaseModel):
    """A message from the user to the AI assistant."""
    message: str = Field(..., min_length=1)

# ──────────────────────────────────────────────
#  Mock Data — Destinations
# ──────────────────────────────────────────────

DESTINATIONS = [
    {
        "id": "marrakech",
        "name": "Marrakech",
        "country": "Morocco",
        "emoji": "🇲🇦",
        "tagline": "The Red City of Wonders",
        "description": "Lose yourself in vibrant souks, stunning palaces, and the intoxicating aromas of Moroccan cuisine. Marrakech blends ancient tradition with modern luxury.",
        "image": "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
        "rating": 4.8,
        "price_range": "$$",
        "weather": "☀️ 28°C",
        "highlights": ["Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace", "Souks"],
        "best_season": "October - April",
    },
    {
        "id": "paris",
        "name": "Paris",
        "country": "France",
        "emoji": "🇫🇷",
        "tagline": "The City of Light & Love",
        "description": "From the Eiffel Tower to hidden cafés, Paris is an eternal masterpiece. World-class art, cuisine, and romance await at every corner.",
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
        "rating": 4.9,
        "price_range": "$$$",
        "weather": "🌤️ 18°C",
        "highlights": ["Eiffel Tower", "Louvre Museum", "Montmartre", "Seine River"],
        "best_season": "April - October",
    },
    {
        "id": "tokyo",
        "name": "Tokyo",
        "country": "Japan",
        "emoji": "🇯🇵",
        "tagline": "Where Tradition Meets the Future",
        "description": "Experience neon-lit streets, ancient temples, and the world's best sushi. Tokyo is a dizzying, exhilarating blend of ultra-modern and deeply traditional.",
        "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        "rating": 4.9,
        "price_range": "$$$",
        "weather": "🌸 22°C",
        "highlights": ["Shibuya Crossing", "Senso-ji Temple", "Akihabara", "Tsukiji Market"],
        "best_season": "March - May",
    },
    {
        "id": "bali",
        "name": "Bali",
        "country": "Indonesia",
        "emoji": "🇮🇩",
        "tagline": "Island of the Gods",
        "description": "Emerald rice terraces, sacred temples, and world-class surf breaks. Bali is a tropical paradise for adventurers and peace-seekers alike.",
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
        "rating": 4.7,
        "price_range": "$",
        "weather": "🌴 30°C",
        "highlights": ["Ubud Rice Terraces", "Uluwatu Temple", "Seminyak Beach", "Mount Batur"],
        "best_season": "April - October",
    },
    {
        "id": "istanbul",
        "name": "Istanbul",
        "country": "Turkey",
        "emoji": "🇹🇷",
        "tagline": "Where East Meets West",
        "description": "Straddling two continents, Istanbul mesmerizes with its grand bazaars, Byzantine mosaics, and the call to prayer echoing across the Bosphorus.",
        "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
        "rating": 4.7,
        "price_range": "$$",
        "weather": "🌤️ 24°C",
        "highlights": ["Hagia Sophia", "Grand Bazaar", "Blue Mosque", "Bosphorus Cruise"],
        "best_season": "April - June",
    },
    {
        "id": "newyork",
        "name": "New York",
        "country": "USA",
        "emoji": "🇺🇸",
        "tagline": "The City That Never Sleeps",
        "description": "Broadway, Central Park, world-class museums, and pizza that dreams are made of. NYC is the ultimate urban adventure.",
        "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
        "rating": 4.8,
        "price_range": "$$$",
        "weather": "🌤️ 20°C",
        "highlights": ["Central Park", "Times Square", "Statue of Liberty", "Brooklyn Bridge"],
        "best_season": "September - November",
    },
]

# ──────────────────────────────────────────────
#  Mock Data — Activities, Hotels, Restaurants
# ──────────────────────────────────────────────

ACTIVITIES_DB = {
    "marrakech": {
        "culture": ["Explore Bahia Palace", "Visit Madrasa Ben Youssef", "Tour the Saadian Tombs"],
        "food": ["Moroccan cooking class", "Street food tour in Jemaa el-Fnaa", "Rooftop dinner with Atlas views"],
        "adventure": ["Hot air balloon over the Atlas Mountains", "Quad biking in Agafay Desert", "Camel ride at sunset"],
        "relaxation": ["Traditional hammam spa", "Tea ceremony in a riad", "Sunset at Majorelle Garden"],
    },
    "paris": {
        "culture": ["Skip-the-line Louvre tour", "Musée d'Orsay impressionist walk", "Montmartre art district tour"],
        "food": ["Pastry masterclass with a French chef", "Wine & cheese tasting in Le Marais", "Seine dinner cruise"],
        "adventure": ["Bike tour along the Seine", "Catacombs exploration", "Day trip to Versailles"],
        "relaxation": ["Luxembourg Gardens picnic", "Spa at a 5-star hotel", "Sunset at Sacré-Cœur"],
    },
    "tokyo": {
        "culture": ["Senso-ji Temple morning visit", "Meiji Shrine forest walk", "Teamlab Borderless digital art"],
        "food": ["Tsukiji outer market sushi tour", "Ramen crawl in Shinjuku", "Izakaya night in Golden Gai"],
        "adventure": ["Mario Kart through the streets", "Day trip to Mount Fuji", "Robot Restaurant show"],
        "relaxation": ["Traditional onsen bath", "Zen garden meditation", "Cherry blossom picnic in Ueno Park"],
    },
    "bali": {
        "culture": ["Tirta Empul temple purification", "Ubud art gallery walk", "Traditional Balinese dance"],
        "food": ["Balinese cooking class in Ubud", "Jimbaran seafood sunset dinner", "Coffee plantation tour"],
        "adventure": ["Surf lessons at Kuta Beach", "Mount Batur sunrise trek", "White water rafting in Ayung River"],
        "relaxation": ["Spa day in Seminyak", "Yoga retreat in Ubud", "Infinity pool overlooking rice terraces"],
    },
    "istanbul": {
        "culture": ["Hagia Sophia guided tour", "Topkapi Palace exploration", "Whirling dervish ceremony"],
        "food": ["Turkish street food tour", "Bosphorus dinner cruise", "Baklava workshop"],
        "adventure": ["Hot air balloon ride (Cappadocia day trip)", "Bosphorus kayaking", "Underground cistern exploration"],
        "relaxation": ["Traditional Turkish bath", "Tea by the Bosphorus", "Sunset at Galata Tower"],
    },
    "newyork": {
        "culture": ["MET Museum highlights tour", "Broadway show", "Street art walk in Bushwick"],
        "food": ["Pizza tour of Brooklyn", "Chinatown dumpling crawl", "Rooftop cocktails in Manhattan"],
        "adventure": ["Brooklyn Bridge walk at sunrise", "Helicopter tour over Manhattan", "Central Park bike ride"],
        "relaxation": ["Spa day in SoHo", "High Line sunset stroll", "Ferry to Governors Island"],
    },
}

HOTELS_DB = {
    "marrakech": [
        {"name": "Riad Yima", "stars": 4, "price_night": 85, "style": "Traditional"},
        {"name": "La Mamounia", "stars": 5, "price_night": 350, "style": "Luxury"},
        {"name": "Hostel Waka Waka", "stars": 2, "price_night": 20, "style": "Budget"},
    ],
    "paris": [
        {"name": "Hôtel Le Petit Paris", "stars": 4, "price_night": 180, "style": "Boutique"},
        {"name": "The Ritz Paris", "stars": 5, "price_night": 900, "style": "Luxury"},
        {"name": "Generator Paris", "stars": 2, "price_night": 40, "style": "Budget"},
    ],
    "tokyo": [
        {"name": "Shinjuku Granbell Hotel", "stars": 4, "price_night": 120, "style": "Modern"},
        {"name": "Aman Tokyo", "stars": 5, "price_night": 700, "style": "Luxury"},
        {"name": "Khaosan Tokyo Kabuki", "stars": 2, "price_night": 25, "style": "Budget"},
    ],
    "bali": [
        {"name": "Alila Ubud", "stars": 4, "price_night": 150, "style": "Eco-luxury"},
        {"name": "Four Seasons Jimbaran", "stars": 5, "price_night": 500, "style": "Luxury"},
        {"name": "Puri Garden Hotel", "stars": 2, "price_night": 18, "style": "Budget"},
    ],
    "istanbul": [
        {"name": "Hotel Empress Zoe", "stars": 4, "price_night": 95, "style": "Boutique"},
        {"name": "Çırağan Palace Kempinski", "stars": 5, "price_night": 450, "style": "Luxury"},
        {"name": "Cheers Hostel", "stars": 2, "price_night": 15, "style": "Budget"},
    ],
    "newyork": [
        {"name": "The Nolitan Hotel", "stars": 4, "price_night": 220, "style": "Boutique"},
        {"name": "The Plaza", "stars": 5, "price_night": 800, "style": "Luxury"},
        {"name": "HI NYC Hostel", "stars": 2, "price_night": 50, "style": "Budget"},
    ],
}

# ──────────────────────────────────────────────
#  Mock AI Chatbot Responses
# ──────────────────────────────────────────────

CHAT_RESPONSES = {
    "hello": "Hello! 👋 I'm your SmartTravelAI assistant. I can help with trip planning, destination tips, packing lists, and more. Where would you like to go?",
    "hi": "Hey there! 🌍 Ready to plan your next adventure? Ask me anything about destinations, budgets, or activities!",
    "budget": "💰 Great question! Here are some budget tips:\n\n• **Budget ($)**: Bali, Istanbul, Marrakech — $30-60/day\n• **Mid-range ($$)**: Most European cities — $80-150/day\n• **Luxury ($$$)**: Paris, Tokyo, NYC — $200+/day\n\nI can help optimize your budget for any destination!",
    "pack": "🧳 Here's a universal packing checklist:\n\n✅ Passport & copies\n✅ Travel adapter\n✅ Comfortable walking shoes\n✅ Weather-appropriate clothing\n✅ Medications & first aid\n✅ Phone charger & power bank\n✅ Travel insurance docs\n\nTell me your destination and I'll customize this!",
    "weather": "🌤️ Weather varies a lot by destination and season! Here's a quick look:\n\n• **Marrakech**: Hot & dry (28-35°C in summer)\n• **Paris**: Mild (15-25°C, rainy in winter)\n• **Tokyo**: Seasonal (cherry blossoms in spring!)\n• **Bali**: Tropical (28-33°C year-round)\n\nWhich destination are you thinking about?",
    "food": "🍽️ Every destination has incredible food! My top picks:\n\n• **Marrakech**: Tagine, couscous, mint tea\n• **Paris**: Croissants, coq au vin, macarons\n• **Tokyo**: Ramen, sushi, matcha\n• **Bali**: Nasi goreng, satay, smoothie bowls\n• **Istanbul**: Kebab, baklava, Turkish coffee\n\nWant restaurant recommendations for a specific city?",
    "default": "🌟 That's a great question! As your AI travel assistant, I can help with:\n\n• 📍 Destination recommendations\n• 📅 Itinerary planning\n• 💰 Budget optimization\n• 🧳 Packing lists\n• 🌤️ Weather & best travel times\n• 🍽️ Food & restaurant tips\n\nWhat would you like to know more about?",
}

# ──────────────────────────────────────────────
#  Saved trips storage (in-memory)
# ──────────────────────────────────────────────
saved_trips: dict[str, dict] = {}

# ──────────────────────────────────────────────
#  Endpoints
# ──────────────────────────────────────────────

@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "🌍 SmartTravelAI API is running!"}


@app.get("/destinations")
def get_destinations():
    """Return all available destinations with full details."""
    return DESTINATIONS


@app.get("/destinations/{destination_id}")
def get_destination(destination_id: str):
    """Return a single destination by its ID."""
    for dest in DESTINATIONS:
        if dest["id"] == destination_id:
            return dest
    raise HTTPException(status_code=404, detail="Destination not found")


@app.post("/trips/generate")
def generate_trip(request: TripRequest):
    """
    Generate a personalized day-by-day itinerary based on user preferences.
    This is the core 'AI' feature — it picks activities, hotel, and meals
    based on budget, interests, and duration.
    """
    dest_id = request.destination.lower().replace(" ", "")

    # Find destination info
    destination = None
    for d in DESTINATIONS:
        if d["id"] == dest_id or d["name"].lower() == request.destination.lower():
            destination = d
            dest_id = d["id"]
            break

    if not destination:
        raise HTTPException(
            status_code=404,
            detail=f"Destination '{request.destination}' not found. Try: Marrakech, Paris, Tokyo, Bali, Istanbul, or New York",
        )

    # Pick hotel based on budget
    hotels = HOTELS_DB.get(dest_id, [])
    budget_map = {"budget": 0, "medium": 1, "luxury": 2}
    hotel_index = min(budget_map.get(request.budget, 1), len(hotels) - 1)
    selected_hotel = hotels[hotel_index] if hotels else {"name": "Local Hotel", "stars": 3, "price_night": 100, "style": "Standard"}

    # Build day-by-day itinerary from activities matching interests
    activities = ACTIVITIES_DB.get(dest_id, {})
    available_activities = []
    for interest in request.interests:
        available_activities.extend(activities.get(interest, []))

    # If no matching interests, grab a mix of everything
    if not available_activities:
        for acts in activities.values():
            available_activities.extend(acts)

    random.shuffle(available_activities)

    # Generate daily plans
    days = []
    for day_num in range(1, request.duration + 1):
        # Pick 2-3 activities per day, cycling through available ones
        day_activities = []
        for i in range(min(3, len(available_activities))):
            idx = ((day_num - 1) * 3 + i) % len(available_activities)
            day_activities.append(available_activities[idx])

        days.append({
            "day": day_num,
            "title": f"Day {day_num}" + (" — Arrival & Explore" if day_num == 1 else " — Departure" if day_num == request.duration else ""),
            "activities": day_activities,
            "meal_suggestion": _get_meal_suggestion(dest_id, day_num),
        })

    # Estimate total cost
    hotel_total = selected_hotel["price_night"] * request.duration * (1 if request.travelers <= 2 else request.travelers // 2)
    daily_expenses = {"budget": 30, "medium": 80, "luxury": 200}
    expenses_total = daily_expenses.get(request.budget, 80) * request.duration * request.travelers
    estimated_cost = hotel_total + expenses_total

    # Save the trip
    trip_id = str(uuid4())
    trip = {
        "id": trip_id,
        "destination": destination,
        "hotel": selected_hotel,
        "days": days,
        "summary": {
            "duration": request.duration,
            "travelers": request.travelers,
            "budget_level": request.budget,
            "interests": request.interests,
            "estimated_cost": estimated_cost,
            "currency": "USD",
        },
        "created_at": datetime.utcnow().isoformat(),
    }
    saved_trips[trip_id] = trip

    return trip


@app.get("/trips/{trip_id}")
def get_trip(trip_id: str):
    """Retrieve a previously generated trip by ID."""
    if trip_id not in saved_trips:
        raise HTTPException(status_code=404, detail="Trip not found")
    return saved_trips[trip_id]


@app.post("/chat")
def chat(msg: ChatMessage):
    """
    AI Chatbot endpoint — returns contextual travel advice.
    Uses keyword matching on mock responses (in production, this would call a GenAI model).
    """
    user_msg = msg.message.lower().strip()

    # Try to match keywords in the user's message
    response = CHAT_RESPONSES["default"]
    for keyword, reply in CHAT_RESPONSES.items():
        if keyword in user_msg:
            response = reply
            break

    return {
        "reply": response,
        "timestamp": datetime.utcnow().isoformat(),
    }


# ── Helper: meal suggestions per destination ──
def _get_meal_suggestion(dest_id: str, day: int) -> str:
    """Return a meal suggestion based on destination and day number."""
    meals = {
        "marrakech": ["Tagine with lamb & prunes", "Couscous royale", "Pastilla & mint tea", "Harira soup & msemen"],
        "paris": ["Croque-monsieur at a café", "Duck confit with red wine", "Crêpes in Montmartre", "Bouillabaisse at a bistro"],
        "tokyo": ["Fresh sushi at Tsukiji", "Tonkotsu ramen in Shinjuku", "Tempura bento box", "Wagyu beef yakiniku"],
        "bali": ["Nasi goreng & fresh juice", "Seafood BBQ at Jimbaran", "Smoothie bowl in Canggu", "Babi guling (roast pork)"],
        "istanbul": ["Turkish breakfast spread", "Iskender kebab", "Meze platter by the Bosphorus", "Lahmacun & ayran"],
        "newyork": ["NYC-style pizza slice", "Pastrami sandwich at Katz's", "Dim sum in Chinatown", "Lobster roll at Chelsea Market"],
    }
    dest_meals = meals.get(dest_id, ["Local cuisine experience"])
    return dest_meals[(day - 1) % len(dest_meals)]


# ──────────────────────────────────────────────
#  Run with: uvicorn main:app --reload --port 8000
# ──────────────────────────────────────────────
