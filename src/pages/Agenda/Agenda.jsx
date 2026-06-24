import EventCard from "../../components/Agenda/EventCard"
import DateFilter from "../../components/Agenda/DateFilter"
import FavoritesButton from "../../components/Agenda/FavoritesButton"


export default function Agenda() {
  return (
    <main className="w-full px-6">
      <h1 className="text-xl font-bold font-archivo-black text-white mb-4 text-left pl-6">Programme</h1>
      <div className="flex items-center justify-between mb-6">
        <DateFilter
          dates={["Dimanche 8 nov.", "Lundi 9 nov."]}
          onDateChange={(date) => console.log(date)}
        />
        <FavoritesButton onToggle={(isActive) => console.log(isActive)} />
    </div>
      <EventCard time="14:00" title="Match de football" location="Stade de France" />
      <EventCard time="16:00" title="Tournoi de jeux vidéo" location="Salle de jeux" />
    </main>
  )
}
