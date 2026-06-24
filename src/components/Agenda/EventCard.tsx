import { MapPin, Star } from "lucide-react";

type EventCardProps = {
  time: string;
  title: string;
  location: string;
};

export default function EventCard({ time, title, location }: EventCardProps) {
  return (
    <div className="flex items-center gap-4 bg-[#1e1e1e] rounded-xl px-4 py-3 mx-4">
      <span className="text-white text-sm font-medium w-12 shrink-0">
        {time}
      </span>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-white text-sm font-medium truncate">{title}</p>
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
          <MapPin size={12} />
          {location}
        </p>
      </div>

      <button className="shrink-0 text-gray-400">
        <Star size={18} fill="none" />
      </button>
    </div>
  );
}
