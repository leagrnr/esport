import EventCard, { EventCardProps } from "../../components/Agenda/EventCard";
import DateFilter from "../../components/Agenda/DateFilter";
import FavoritesButton from "../../components/Agenda/FavoritesButton";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/SupabaseClient";

type ProgrammeEvent = Omit<EventCardProps, "isFavorite" | "onToggleFavorite">;

export default function Agenda() {
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

      console.log(data);

      if (data)
        setEvents(
          data.map((e: any) => ({
            id: String(e.id),
            title: `${e.equipe1.initial} vs ${e.equipe2.initial}`,
            location: e.lieu ?? "",
            game: e.jeu_id === 2 ? "valorant" : e.jeu_id === 1 ? "lol" : "",
            time: new Date(e.date_heure),
          })),
        );
    };

    fetchEvents();
  }, []);

  return (
    <main className="w-full px-6">
      <h1 className="text-xl font-bold font-archivo-black text-white mb-4 text-left pl-6">
        Programme
      </h1>
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
      {events
        .filter((event) => {
          if (showFavorites && !favorites.includes(event.id)) return false;
          const dateStr = event.time.toISOString().split("T")[0];
          if (activeDate === "Dimanche 8 nov.") return dateStr === "2025-11-08";
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
            />
          );
        })}
    </main>
  );
}
