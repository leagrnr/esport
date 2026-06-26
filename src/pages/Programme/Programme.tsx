import EventCard, {
  EventCardProps,
} from "../../components/Programme/EventCard";
import DateFilter from "../../components/Programme/DateFilter";
import FavoritesButton from "../../components/Programme/FavoritesButton";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/SupabaseClient";
import { useNavigate } from "react-router-dom";

type ProgrammeEvent = Omit<
  EventCardProps,
  "isFavorite" | "onToggleFavorite" | "onClick"
>;

export default function Programme() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ProgrammeEvent[]>([]);
  const [favorites, saveFavorites] = useLocalStorage<string[]>("favorites", []);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [activeDate, setActiveDate] = useState<string>("Dimanche 8 nov.");

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await (supabase as any)
        .from("programme")
        .select(
          `
          *,
          equipe1:equipe1_id(initial),
          equipe2:equipe2_id(initial)
        `,
        )
        .order("date_heure", { ascending: true });

      if (data)
        setEvents(
          data.map((e: any) => ({
            id: String(e.id),
            title:
              e.equipe1 && e.equipe2
                ? `${e.equipe1.initial} vs ${e.equipe2.initial}`
                : e.nom || e.titre || "Événement",
            location: e.lieu ?? "",
            time: new Date(e.date_heure),
            jeuId: e.jeu_id,
          })),
        );
    };

    fetchEvents();
  }, []);

  return (
    <main className="w-full px-6 pb-36">
      <p className="text-gray-100 text-xl font-black tracking-wider uppercase leading-tight mb-4 pt-2 pb-4 text-left">
        Programme
      </p>
      <div className="flex items-center justify-between mb-6">
        <DateFilter
          dates={["Dimanche 8 nov.", "Lundi 9 nov."]}
          onDateChange={(date) => setActiveDate(date)}
        />
        <FavoritesButton
          onToggle={() => setShowFavorites((prev) => !prev)}
          isActive={showFavorites}
        />
      </div>

      <div className="space-y-1">
        {events
          .filter((event) => {
            if (showFavorites && !favorites.includes(event.id)) return false;
            const dateStr = event.time.toISOString().split("T")[0];
            if (activeDate === "Dimanche 8 nov.")
              return dateStr === "2025-11-08";
            if (activeDate === "Lundi 9 nov.") return dateStr === "2025-11-09";
            return true;
          })
          .map((event) => {
            const isFavorite = favorites.includes(event.id);
            return (
              <EventCard
                key={event.id}
                {...event}
                onToggleFavorite={() => {
                  if (isFavorite) {
                    saveFavorites(
                      favorites.filter((element) => event.id !== element),
                    );
                    return;
                  }
                  saveFavorites((prev) => [...prev, event.id]);
                }}
                isFavorite={isFavorite}
                onClick={() => navigate(`/affrontement/${event.id}`)}
              />
            );
          })}
      </div>
    </main>
  );
}
