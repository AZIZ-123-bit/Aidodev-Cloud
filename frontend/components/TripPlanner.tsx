"use client";

import { useState } from "react";
import { TripRequest } from "@/lib/api";

// Available interest tags with their emojis
const INTEREST_OPTIONS = [
    { id: "culture", label: "🏛️ Culture" },
    { id: "food", label: "🍽️ Food" },
    { id: "adventure", label: "🧗 Adventure" },
    { id: "relaxation", label: "🧘 Relaxation" },
];

interface TripPlannerProps {
    onGenerate: (request: TripRequest) => void;
    loading: boolean;
    destinations: { id: string; name: string; emoji: string }[];
}

/**
 * TripPlanner — Form for configuring trip preferences.
 * Includes destination picker, budget slider, duration, interests, and travelers.
 */
export default function TripPlanner({
    onGenerate,
    loading,
    destinations,
}: TripPlannerProps) {
    const [destination, setDestination] = useState("");
    const [budget, setBudget] = useState<"budget" | "medium" | "luxury">("medium");
    const [duration, setDuration] = useState(3);
    const [interests, setInterests] = useState<string[]>(["culture", "food"]);
    const [travelers, setTravelers] = useState(1);

    const toggleInterest = (id: string) => {
        setInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!destination) return;
        onGenerate({ destination, budget, duration, interests, travelers });
    };

    // Budget display config
    const budgetConfig = {
        budget: { label: "Budget 💰", color: "text-emerald-400" },
        medium: { label: "Mid-range 💳", color: "text-amber-400" },
        luxury: { label: "Luxury 💎", color: "text-violet-400" },
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="glass-strong rounded-3xl p-8 animate-fade-slide-up"
            id="planner"
        >
            <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
                ✈️ Plan Your Trip
            </h2>
            <p className="text-white/40 text-sm mb-7">
                Tell us your preferences and we&apos;ll create the perfect itinerary.
            </p>

            <div className="space-y-6">
                {/* ── Destination Selector ── */}
                <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">
                        Where to?
                    </label>
                    <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all duration-200 appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-slate-900">
                            Select a destination...
                        </option>
                        {destinations.map((d) => (
                            <option key={d.id} value={d.name} className="bg-slate-900">
                                {d.emoji} {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ── Budget & Duration Row ── */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Budget */}
                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">
                            Budget:{" "}
                            <span className={budgetConfig[budget].color}>
                                {budgetConfig[budget].label}
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            value={budget === "budget" ? 0 : budget === "medium" ? 1 : 2}
                            onChange={(e) => {
                                const vals: ("budget" | "medium" | "luxury")[] = [
                                    "budget",
                                    "medium",
                                    "luxury",
                                ];
                                setBudget(vals[parseInt(e.target.value)]);
                            }}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-white/10"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">
                            Duration:{" "}
                            <span className="text-orange-300">{duration} days</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="14"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-white/10"
                        />
                    </div>
                </div>

                {/* ── Travelers ── */}
                <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">
                        Travelers
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setTravelers(n)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                  ${travelers === n
                                        ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                                        : "border-white/10 text-white/40 hover:bg-white/5"
                                    }`}
                            >
                                {n === 5 ? "5+" : n}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Interests ── */}
                <div>
                    <label className="block text-sm font-medium text-white/50 mb-3">
                        Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleInterest(opt.id)}
                                className={`interest-tag px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                  ${interests.includes(opt.id)
                                        ? "bg-orange-500/20 text-orange-300 border-orange-500/30 selected shadow-sm shadow-orange-500/10"
                                        : "border-white/10 text-white/40 hover:bg-white/5"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Submit ── */}
                <button
                    type="submit"
                    disabled={!destination || loading}
                    className="w-full py-4 rounded-xl font-semibold text-[15px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="w-5 h-5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Generating your trip...
                        </span>
                    ) : (
                        "✨ Generate My Trip"
                    )}
                </button>
            </div>
        </form>
    );
}
