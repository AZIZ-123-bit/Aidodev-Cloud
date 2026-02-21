"use client";

import { useState, useEffect, useCallback } from "react";
import { Destination, Trip, fetchDestinations, generateTrip, TripRequest } from "@/lib/api";
import TripPlanner from "@/components/TripPlanner";
import ItineraryView from "@/components/ItineraryView";
import DestinationCard from "@/components/DestinationCard";
import ChatBot from "@/components/ChatBot";

/**
 * SmartTravelAI — Main page
 * Sections: Hero → Trip Planner → Generated Itinerary → Explore Destinations → ChatBot
 */
export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track currently selected destination from cards so the planner can prefill
  const [selectedDestination, setSelectedDestination] = useState("");

  // ── Load destinations on mount ──
  const loadDestinations = useCallback(async () => {
    try {
      const data = await fetchDestinations();
      setDestinations(data);
    } catch {
      setError("Could not connect to the backend. Make sure it's running on port 8000.");
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  // ── Generate a trip ──
  const handleGenerate = async (request: TripRequest) => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateTrip(request);
      setTrip(result);
      // Smooth scroll to itinerary
      setTimeout(() => {
        document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Failed to generate trip. Check that the backend is running.");
    } finally {
      setGenerating(false);
    }
  };

  // ── When user clicks "Plan Trip" on a destination card ──
  const handleSelectDestination = (name: string) => {
    setSelectedDestination(name);
    setTrip(null);
    // Scroll to planner
    setTimeout(() => {
      document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="relative z-10 min-h-screen">
      {/* ══════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════ */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-slide-up">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 animate-float">
            <span className="text-2xl">✈️</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
              SmartTravelAI
            </span>
          </h1>
        </div>

        <p className="text-white/50 text-lg max-w-xl mx-auto mb-8 animate-fade-slide-up" style={{ animationDelay: "0.1s" }}>
          Plan, organize, and optimize your travels with AI. Get personalized
          itineraries, smart recommendations, and real-time assistance.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 animate-fade-slide-up" style={{ animationDelay: "0.2s" }}>
          <a
            href="#planner"
            className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200"
          >
            Plan a Trip ✨
          </a>
          <a
            href="#destinations"
            className="px-6 py-3 rounded-xl font-semibold text-sm border border-white/10 text-white/60 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
          >
            Explore Destinations
          </a>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-12 animate-fade-slide-up" style={{ animationDelay: "0.3s" }}>
          {[
            { value: "6+", label: "Destinations" },
            { value: "AI", label: "Powered" },
            { value: "24/7", label: "Assistant" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-white/30 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ══════════════════════════════════════════
          ERROR BANNER
          ══════════════════════════════════════════ */}
      {error && (
        <div className="max-w-2xl mx-auto px-6 mb-8">
          <div className="glass rounded-2xl p-5 border-rose-500/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                <span>⚠️</span>
              </div>
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TRIP PLANNER
          ══════════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto px-6 mb-16">
        {trip ? (
          <ItineraryView trip={trip} onReset={() => setTrip(null)} />
        ) : (
          <TripPlanner
            onGenerate={handleGenerate}
            loading={generating}
            destinations={destinations.map((d) => ({
              id: d.id,
              name: d.name,
              emoji: d.emoji,
            }))}
            key={selectedDestination}
          />
        )}
      </section>

      {/* ══════════════════════════════════════════
          EXPLORE DESTINATIONS
          ══════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-24" id="destinations">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
            🌍 Explore Destinations
          </h2>
          <p className="text-white/40 text-sm">
            Discover handpicked destinations curated by our AI.
          </p>
        </div>

        {destinations.length === 0 && !error ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((dest, idx) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                index={idx}
                onSelect={handleSelectDestination}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-white/15 text-xs">
        Built with ❤️ using FastAPI + Next.js + AI · SmartTravelAI © 2026
      </footer>

      {/* ══════════════════════════════════════════
          AI CHATBOT (floating)
          ══════════════════════════════════════════ */}
      <ChatBot />
    </div>
  );
}
