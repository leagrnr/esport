import { useState } from "react";
import { MapPin, Star } from "lucide-react";

export type EventCardProps = {
  id: string;
  time: Date;
  title: string;
  location: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function EventCard({
  time,
  title,
  location,
  isFavorite = false,
  onToggleFavorite,
}: EventCardProps) {
  return (
    <div className="flex items-center gap-4 bg-[#1e1e1e] rounded-xl px-4 py-3 mx-4 mb-4">
      <span className="text-white text-sm font-medium w-12 shrink-0">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-white text-sm font-medium truncate">{title}</p>
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
          <MapPin size={12} />
          {location}
        </p>
      </div>
      <button
        onClick={onToggleFavorite}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
        className={`shrink-0 transition-colors ${isFavorite ? "text-yellow-400" : "text-gray-400"}`}
      >
        <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
