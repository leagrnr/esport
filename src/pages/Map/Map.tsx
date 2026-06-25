import { useState } from "react";
import ScanCard from "../../components/Quetes/questScan";
import QuestProgression from "../../components/Quetes/questProgression";

const stands = [
  { id: "A", title: "Logitech G", subtitle: "Tapis de souris + 20pts" },
  { id: "B", title: "RedBull", subtitle: "1 redbull gratuite + 20pts" },
  { id: "C", title: "Razer", subtitle: "Clavier mécanique + 20pts" },
  { id: "D", title: "SNCF Connect", subtitle: "1 bon de réduction + 20pts" },
  { id: "E", title: "Samsung", subtitle: "1 bon de réduction + 20pts" },
];

export default function Map() {
  const [scanned, setScanned] = useState<string[]>([]);

  const handleScan = (standId: string) => {
    if (!scanned.includes(standId)) {
      setScanned((prev) => [...prev, standId]);
    }
  };

  return (
    <main className="w-full px-6">
      <h1
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
        className="text-xl text-white mb-4 text-left"
      >
        Quêtes
      </h1>
      <QuestProgression
        title="Quête des stands"
        current={scanned.length}
        total={stands.length}
        description="Scannez le QR des 5 stands partenaires pour débloquer la roulette à goodies"
      />
      {stands.map((stand) => (
        <ScanCard
          key={stand.id}
          stand={`Stand ${stand.id}`}
          title={stand.title}
          subtitle={stand.subtitle}
          scanned={scanned.includes(stand.id)}
          onScan={() => handleScan(stand.id)}
        />
      ))}
    </main>
  );
}
