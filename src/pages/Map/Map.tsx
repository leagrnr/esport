import { useState } from "react";
import ScanCard from "../../components/Quetes/questScan";
import QuestProgression from "../../components/Quetes/questProgression";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Trophy } from "lucide-react";

const stands = [
    { id: "A", title: "Logitech G", subtitle: "Tapis de souris + 20pts", x: 220, y: 140, type: "stand" },
    { id: "B", title: "RedBull", subtitle: "1 redbull gratuite + 20pts", x: 460, y: 100, type: "stand" },
    { id: "C", title: "Razer", subtitle: "Clavier mécanique + 20pts", x: 380, y: 340, type: "stand" },
    { id: "D", title: "SNCF Connect", subtitle: "1 bon de réduction + 20pts", x: 180, y: 280, type: "stand" },
    { id: "E", title: "Samsung", subtitle: "1 bon de réduction + 20pts", x: 540, y: 240, type: "stand" },
    { id: "MATCH", title: "Grande Scène (Matchs)", subtitle: "Suivi des tournois en live", x: 760, y: 200, type: "scene" },
];

export default function Map() {
    const [scanned, setScanned] = useLocalStorage<string[]>("scanned", []);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeInfo, setActiveInfo] = useState<string>("Sélectionne un lieu");

    const handleScan = (standId: string) => {
        if (!scanned.includes(standId)) {
            setScanned((prev) => [...prev, standId]);
        }
    };

    const entryX = 120;
    const entryY = 510;

    const generateSmartPath = () => {
        const target = stands.find(s => s.id === selectedId);
        if (!target) return "";

        const exitEntryX = 120;
        const exitEntryY = 420;

        return `M ${entryX} ${entryY} 
            L ${exitEntryX} ${exitEntryY} 
            L ${exitEntryX} ${target.y} 
            L ${target.x} ${target.y}`;
    };

    return (
        <main className="w-full max-w-sm mx-auto px-4 pb-36 box-border font-sans">

            <style>{`
        @keyframes blueprint-dash {
          to { stroke-dashoffset: -20; }
        }
        .animate-pathfinder {
          animation: blueprint-dash 1s linear infinite;
        }
      `}</style>

            <p className="text-gray-100 text-xl font-black tracking-wider uppercase leading-tight mb-4 pt-4 pb-2 text-left">
                Quêtes & Plan
            </p>

            {/* CARD CONTENEUR DU PLAN */}
            <div className="w-full bg-[#121214] border border-[#212124] rounded-2xl p-3 mb-6 flex flex-col box-border shadow-2xl">
                <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] font-black tracking-widest font-mono text-gray-500 uppercase">
            Plan Technique Interactif
          </span>
                    <span className="text-[10px] font-bold font-mono text-[#ff4655] bg-black/50 px-2 py-0.5 rounded border border-gray-900/60 truncate max-w-50">
            {activeInfo}
          </span>
                </div>

                {/* CONTENEUR VECTORIEL REHAUSSÉ (FOND CHARCOAL LUMINEUX) */}
                <div className="relative w-full aspect-900/560 bg-[#18181c] border border-gray-950 rounded-xl overflow-hidden">

                    <svg viewBox="0 0 900 560" className="absolute inset-0 w-full h-full">
                        {/* 🔴 LE CADRILLAGE FIN AUX COULEURS DE LA DA */}
                        <defs>
                            <pattern id="red-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ff4655" strokeWidth="1" strokeOpacity="0.1" />
                            </pattern>
                        </defs>
                        <rect width="900" height="560" fill="url(#red-grid)" />

                        {/* 🏢 RECONSTRUCTION DES COLISONS VISIBLES */}
                        {/* Murs extérieurs du bâtiment */}
                        <rect x="10" y="10" width="880" height="540" fill="none" stroke="#52525b" strokeWidth="2.5" />

                        {/* Zone Droite : LA FOSSE (Fond rouge translucide pour identification de zone) */}
                        <rect x="620" y="10" width="270" height="450" fill="#ff4655" fillOpacity="0.03" />
                        <line x1="620" y1="10" x2="620" y2="460" stroke="#52525b" strokeWidth="2" strokeDasharray="5 4" />
                        <text x="760" y="240" fill="#3f3f46" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="6">FOSSE</text>

                        {/* Cloison Gauche : DEPOT RELAIS */}
                        <line x1="100" y1="10" x2="100" y2="460" stroke="#52525b" strokeWidth="2" />
                        <text x="50" y="240" fill="#3f3f46" fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="2" transform="rotate(-90 50 240)">DEPOT RELAIS</text>

                        {/* Rangée Technique Basse (Entrées, Pièces techniques, Sanitaires) */}
                        <line x1="10" y1="460" x2="890" y2="460" stroke="#52525b" strokeWidth="2" />
                        <line x1="220" y1="460" x2="220" y2="550" stroke="#3f3f46" strokeWidth="1.5" />
                        <line x1="420" y1="460" x2="420" y2="550" stroke="#3f3f46" strokeWidth="1.5" />
                        <line x1="680" y1="460" x2="680" y2="550" stroke="#3f3f46" strokeWidth="1.5" />

                        {/* Noms des zones d'origine */}
                        <text x="115" y="510" fill="#a1a1aa" fontSize="10" fontWeight="900" textAnchor="middle">SAS D'ENTRÉE</text>
                        <text x="320" y="510" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">SANITAIRES (WC)</text>
                        <text x="550" y="510" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">CABINE PROJECTION</text>
                        <text x="785" y="510" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">SAS EN SCÈNE</text>

                        <text x="360" y="240" fill="#27272a" fontSize="24" fontWeight="900" textAnchor="middle" letterSpacing="10">PLATEAU</text>

                        {/* Poteaux porteurs structurels */}
                        <g stroke="#3f3f46" strokeWidth="1.5" fill="#18181c">
                            <rect x="240" y="220" width="16" height="16" /> <line x1="240" y1="220" x2="256" y2="236" /> <line x1="256" y1="220" x2="240" y2="236" />
                            <rect x="490" y="220" width="16" height="16" /> <line x1="490" y1="220" x2="506" y2="236" /> <line x1="506" y1="220" x2="490" y2="236" />
                        </g>

                        {/* Point de départ du visiteur (Sas Entrée) */}
                        <circle cx={entryX} cy={entryY} r="5" fill="#ff4655" />
                        <circle cx={entryX} cy={entryY} r="12" fill="none" stroke="#ff4655" strokeWidth="1.5" className="animate-pulse" opacity="0.5" />

                        {/* ⚡ LASER DE RECHERCHE D'ITINERAIRE FILTRE DA ROUGE */}
                        {selectedId && (
                            <path
                                d={generateSmartPath()}
                                fill="none"
                                stroke="#ff4655"
                                strokeWidth="2.5"
                                strokeDasharray="6 4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="animate-pathfinder"
                            />
                        )}
                    </svg>

                    {/* 🎯 INTEGRATION DES PICKERS DANS L'ESPRIT DE LA DA */}
                    {stands.map((stand) => {
                        const isScanned = scanned.includes(stand.id);
                        const isSelected = selectedId === stand.id;

                        const leftPercent = `${(stand.x / 900) * 100}%`;
                        const topPercent = `${(stand.y / 560) * 100}%`;

                        return (
                            <button
                                key={stand.id}
                                onClick={() => {
                                    setSelectedId(stand.id);
                                    setActiveInfo(stand.type === 'scene' ? stand.title : `Stand ${stand.id} : ${stand.title}`);
                                }}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none z-20 group"
                                style={{ left: leftPercent, top: topPercent }}
                            >
                                {stand.type === "scene" ? (
                                    <div className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                                        isSelected
                                            ? "bg-[#ff4655] text-white border-white shadow-[0_0_15px_#ff4655] scale-110"
                                            : "bg-[#121214] text-[#ff4655] border-[#ff4655]/40 hover:border-[#ff4655]"
                                    }`}>
                                        <Trophy size={11} className={isSelected ? "" : "animate-pulse"} />
                                    </div>
                                ) : (
                                    <div className="relative flex items-center justify-center">
                                        {isSelected && (
                                            <span className="absolute w-5 h-5 rounded-full bg-[#ff4655]/20 animate-ping pointer-events-none" />
                                        )}
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-black transition-all ${
                                            isScanned
                                                /* 🟥 STAND COMPLÉTÉ : Rouge Événementiel éclatant */
                                                ? "bg-[#ffj655] text-white border-white/40 shadow-[0_0_12px_#ff4655]"
                                                : isSelected
                                                    /* STAND RECHERCHÉ : Blanc pur en évidence */
                                                    ? "bg-white text-black border-black scale-120 shadow-[0_0_15px_rgba(255,255,255,0.9)]"
                                                    /* ⬛ STAND FERMÉ : Anthracite mat sobre avec cœur rouge sombre */
                                                    : "bg-[#27272a] text-gray-400 border-gray-800 group-hover:bg-gray-700 group-hover:text-white"
                                        }`}>
                                            {!isScanned && !isSelected && <span className="w-1 h-1 rounded-full bg-[#ff4655]/80" />}
                                            {(isScanned || isSelected) && stand.id}
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PROGRESSION DE LA QUÊTE */}
            <QuestProgression
                title="Quête des stands"
                current={scanned.length}
                total={stands.filter(s => s.type === 'stand').length}
                description="Scannez le QR des 5 stands partenaires pour débloquer la roulette à goodies"
            />

            {/* LISTE DES CARDS EN DESSOUS */}
            <div className="flex flex-col space-y-3 mt-4">
                {stands.map((stand) => (
                    <div
                        key={stand.id}
                        onClick={() => {
                            setSelectedId(stand.id);
                            setActiveInfo(stand.type === 'scene' ? stand.title : `Stand ${stand.id} : ${stand.title}`);
                        }}
                    >
                        <ScanCard
                            stand={stand.type === 'scene' ? "COMPÉTITION" : `Stand ${stand.id}`}
                            title={stand.title}
                            subtitle={stand.subtitle}
                            scanned={stand.type === 'scene' ? true : scanned.includes(stand.id)}
                            onScan={() => stand.type === 'stand' && handleScan(stand.id)}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}