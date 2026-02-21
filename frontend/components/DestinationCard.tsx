"use client";

import { Destination } from "@/lib/api";

interface DestinationCardProps {
    destination: Destination;
    index: number;
    onSelect: (name: string) => void;
}

/**
 * DestinationCard — Premium card showcasing a travel destination
 * with image, rating, weather, highlights, and a CTA button.
 */
export default function DestinationCard({
    destination,
    index,
    onSelect,
}: DestinationCardProps) {
    const staggerClass = `stagger-${Math.min(index + 1, 6)}`;

    return (
        <div
            className={`glass rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 animate-fade-slide-up opacity-0 ${staggerClass} group`}
        >
            {/* Image placeholder with gradient overlay */}
            <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Rating badge */}
                <div className="absolute top-3 right-3 glass rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1">
                    ⭐ {destination.rating}
                </div>

                {/* Weather badge */}
                <div className="absolute top-3 left-3 glass rounded-lg px-2.5 py-1 text-xs font-medium">
                    {destination.weather}
                </div>

                {/* Name overlay */}
                <div className="absolute bottom-3 left-4">
                    <h3 className="text-lg font-bold text-white">
                        {destination.emoji} {destination.name}
                    </h3>
                    <p className="text-white/50 text-xs">{destination.country}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <p className="text-white/40 text-sm leading-relaxed mb-3 line-clamp-2">
                    {destination.tagline}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {destination.highlights.slice(0, 3).map((h) => (
                        <span
                            key={h}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-white/30 border border-white/5"
                        >
                            {h}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <span className="text-white/30 text-sm">
                        {destination.price_range} · {destination.best_season}
                    </span>
                    <button
                        onClick={() => onSelect(destination.name)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/20 hover:bg-orange-500/25 transition-all duration-200"
                    >
                        Plan Trip →
                    </button>
                </div>
            </div>
        </div>
    );
}
