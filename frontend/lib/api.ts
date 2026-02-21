/**
 * SmartTravelAI API Client
 * Handles all communication with the FastAPI backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Types ──

export interface Destination {
    id: string;
    name: string;
    country: string;
    emoji: string;
    tagline: string;
    description: string;
    image: string;
    rating: number;
    price_range: string;
    weather: string;
    highlights: string[];
    best_season: string;
}

export interface Hotel {
    name: string;
    stars: number;
    price_night: number;
    style: string;
}

export interface DayPlan {
    day: number;
    title: string;
    activities: string[];
    meal_suggestion: string;
}

export interface TripSummary {
    duration: number;
    travelers: number;
    budget_level: string;
    interests: string[];
    estimated_cost: number;
    currency: string;
}

export interface Trip {
    id: string;
    destination: Destination;
    hotel: Hotel;
    days: DayPlan[];
    summary: TripSummary;
    created_at: string;
}

export interface TripRequest {
    destination: string;
    budget: "budget" | "medium" | "luxury";
    duration: number;
    interests: string[];
    travelers: number;
}

export interface ChatResponse {
    reply: string;
    timestamp: string;
}

// ── API Functions ──

/** Fetch all destinations */
export async function fetchDestinations(): Promise<Destination[]> {
    const res = await fetch(`${API_BASE}/destinations`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch destinations");
    return res.json();
}

/** Generate a personalized trip */
export async function generateTrip(request: TripRequest): Promise<Trip> {
    const res = await fetch(`${API_BASE}/trips/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Failed to generate trip");
    return res.json();
}

/** Send a message to the AI chatbot */
export async function sendChatMessage(message: string): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
}
