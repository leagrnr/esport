import { MapPin, Star } from "lucide-react";

export type EventCardProps = {
    id: string;
    time: Date;
    title: string;
    location: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onClick: () => void;
    jeuId?: number | null; // 🚀 Prop ajoutée pour identifier le jeu (1 = Valo, 2 = LoL)
};

export default function EventCard({
                                      time,
                                      title,
                                      location,
                                      isFavorite = false,
                                      onToggleFavorite,
                                      onClick,
                                      jeuId, // 🚀 Injection de la prop
                                  }: EventCardProps) {

    // 🎨 Configuration par défaut (Animations, pauses, cérémonies...)
    let cardStyle = "bg-[#121214] border-[#212124] hover:border-gray-700";
    let timeColor = "text-white";

    // 🟨 Configuration pour LEAGUE OF LEGENDS (jeu_id === 1)
    if (jeuId === 1) {
        cardStyle = "bg-linear-to-r from-[#1a140d] to-[#121214] border-[#c8aa6e]/15 hover:border-[#c8aa6e]/40";
        timeColor = "text-[#c8aa6e]";
    }
    // 🟥 Configuration pour VALORANT (jeu_id === 2)
    else if (jeuId === 2) {
        cardStyle = "bg-linear-to-r from-[#1e0a0c] to-[#121214] border-red-950/40 hover:border-red-800/50";
        timeColor = "text-[#ff4655]";
    }

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-4 border rounded-xl px-4 py-3 mx-4 mb-4 cursor-pointer active:scale-[0.99] transition-all ${cardStyle}`}
        >
            {/* L'heure s'illumine désormais aux couleurs du jeu ⚡ */}
            <span className={`text-sm font-bold w-12 shrink-0 font-mono ${timeColor}`}>
                {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>

            <div className="flex-1 min-w-0 text-left">
                <p className="text-white text-sm font-medium truncate font-sans">{title}</p>
                <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5 font-sans">
                    <MapPin size={12} />
                    {location}
                </p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
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