import EventCard, { EventCardProps } from "../../components/Agenda/EventCard";
import DateFilter from "../../components/Agenda/DateFilter";
import FavoritesButton from "../../components/Agenda/FavoritesButton";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useState } from "react";

export default function Agenda() {
  const events: Omit<EventCardProps, "isFavorite" | "onToggleFavorite">[] = [
    {
      time: new Date("2023-11-09T14:00:00"),
      title: "Match de football",
      location: "Stade de France",
      id: "1",
    },
    {
      time: new Date("2023-11-09T16:00:00"),
      title: "Tournoi de jeux vidéo",
      location: "Salle de jeux",
      id: "2",
    },
    {
      time: new Date("2023-11-09T18:00:00"),
      title: "Concert de musique",
      location: "Salle de concert",
      id: "3",
    },
    {
      time: new Date("2023-11-09T19:00:00"),
      title: "Conférence sur l'IA",
      location: "Centre de conférence",
      id: "4",
    },
    {
      time: new Date("2023-11-09T20:00:00"),
      title: "Exposition d'art",
      location: "Galerie d'art",
      id: "5",
    },
  ];

  const [favorites, saveFavorites] = useLocalStorage<string[]>("favorites", []);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  return (
    <main className="w-full px-6">
      <h1 className="text-xl font-bold font-archivo-black text-white mb-4 text-left pl-6">
        Programme
      </h1>
      <div className="flex items-center justify-between mb-6">
        <DateFilter
          dates={["Dimanche 8 nov.", "Lundi 9 nov."]}
          onDateChange={(date) => console.log(date)}
        />
        <FavoritesButton
          onToggle={() => setShowFavorites((prev) => !prev)}
          isActive={showFavorites}
        />
      </div>
      {events
        .filter((event) => {
          if (!showFavorites) return true;
          return favorites.includes(event.id);
        })
        .map((event) => {
          const isFavorite = favorites.includes(event.id);
          return (
            <EventCard
              {...event}
              onToggleFavorite={() => {
                if (isFavorite) {
                  saveFavorites(
                    favorites.filter((element) => event.id != element),
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
