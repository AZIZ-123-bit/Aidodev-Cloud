"use client";

import { Trip } from "@/lib/api";

interface ItineraryViewProps {
    trip: Trip;
    onReset: () => void;
}

/**
 * ItineraryView — Displays a generated trip with day-by-day timeline,
 * hotel info, cost summary, and a reset button.
 */
export default function ItineraryView({ trip, onReset }: ItineraryViewProps) {
    const { destination, hotel, days, summary } = trip;

    return (
        <div className="animate-fade-slide-up" id="itinerary">
            {/* ── Header with destination info ── */}
            <div className="glass-strong rounded-3xl p-8 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-white/40 text-sm mb-1">Your AI-generated trip to</p>
                        <h2 className="text-3xl font-bold">
                            <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
                                {destination.emoji} {destination.name}
                            </span>
                        </h2>
                        <p className="text-white/50 text-sm mt-1">{destination.tagline}</p>
                    </div>
                    <button
                        onClick={onReset}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
                    >
                        ← New Trip
                    </button>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-4 gap-3 mt-6">
                    {[
                        { label: "Duration", value: `${summary.duration} days`, icon: "📅" },
                        { label: "Hotel", value: hotel.name, icon: "🏨" },
                        { label: "Budget", value: summary.budget_level, icon: "💰" },
                        {
                            label: "Est. Cost",
                            value: `$${summary.estimated_cost.toLocaleString()}`,
                            icon: "💵",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="glass rounded-2xl p-4 text-center"
                        >
                            <p className="text-xl mb-1">{stat.icon}</p>
                            <p className="text-white/90 font-semibold text-sm truncate">
                                {stat.value}
                            </p>
                            <p className="text-white/30 text-xs mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Day-by-day timeline ── */}
            <div className="space-y-4">
                {days.map((day, idx) => (
                    <div
                        key={day.day}
                        className={`glass rounded-2xl p-6 animate-fade-slide-up opacity-0 stagger-${Math.min(idx + 1, 6)}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {/* Day number badge */}
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-orange-500/20">
                                {day.day}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white/90">{day.title}</h3>
                                <p className="text-white/30 text-xs">{destination.name}, {destination.country}</p>
                            </div>
                        </div>

                        {/* Activities list */}
                        <div className="space-y-2 ml-[52px]">
                            {day.activities.map((activity, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 text-sm text-white/60"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400/60 flex-shrink-0" />
                                    {activity}
                                </div>
                            ))}
                            {/* Meal suggestion */}
                            <div className="flex items-center gap-3 text-sm text-amber-400/60 mt-3 pt-3 border-t border-white/5">
                                <span>🍽️</span>
                                {day.meal_suggestion}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Hotel details ── */}
            <div className="glass rounded-2xl p-6 mt-6 animate-fade-slide-up">
                <h3 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
                    🏨 Your Accommodation
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 font-medium">{hotel.name}</p>
                        <p className="text-white/30 text-sm">
                            {"⭐".repeat(hotel.stars)} · {hotel.style}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-orange-300 font-bold text-lg">
                            ${hotel.price_night}
                        </p>
                        <p className="text-white/30 text-xs">per night</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
