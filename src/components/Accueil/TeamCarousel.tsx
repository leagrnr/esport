import {useState, useEffect} from "react";
import type { Database } from '../../types/supabase';

type EquipeRow = Database['public']['Tables']['equipe']['Row'];

export function TeamCarousel({ teams, game }: { teams: EquipeRow[]; game: 'Valorant' | 'League of Legends' }) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // Force le carrousel à revenir au début (index 0) quand on change de jeu (Valo / LoL)
    useEffect(() => {
        setCurrentIndex(0);
    }, [game, teams]);

    // Si aucune équipe n'est chargée, on affiche un indicateur de sécurité
    if (!teams || teams.length === 0) {
        return (
            <div className="text-center py-8 text-xs text-gray-500 font-mono uppercase tracking-widest">
                Aucune équipe disponible
            </div>
        );
    }

    // Gestion du défilement infini (Circulaire)
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + teams.length) % teams.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % teams.length);
    };

    // Calcul dynamique des 3 équipes à afficher (Gauche, Centre, Droite)
    const leftTeam = teams[currentIndex];
    const centerTeam = teams[(currentIndex + 1) % teams.length];
    const rightTeam = teams[(currentIndex + 2) % teams.length];

    const visibleTeams = [leftTeam, centerTeam, rightTeam];

    // Préparation de la DA dynamique selon le jeu actif
    const isValo = game === 'Valorant';
    const cardBorder = isValo ? 'border-red-950/40' : 'border-[#c8aa6e]/30';
    const gradientColor = isValo ? 'from-[#360407]' : 'from-[#1f180e]';

    return (
        <div className="relative flex items-center justify-center w-full overflow-hidden min-h-50">
            {/* Flèche Gauche */}
            <button
                onClick={handlePrev}
                className="absolute left-0 z-20 text-gray-500 hover:text-white transition-colors bg-[#070708]/90 rounded-full p-0.5 cursor-pointer active:scale-90"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>

            {/* Grille des 3 cartes physiques */}
            <div className="grid grid-cols-3 w-full gap-2 px-5 box-border items-center">
                {visibleTeams.map((team, index) => {
                    // L'élément du milieu (index 1 de notre sélection) reste la vedette (Rang 01 + zoom)
                    const isCenter = index === 1;
                    const rankDisplay = isCenter ? "01" : "02";

                    return (
                        <div
                            key={`${team.id}-${index}`} // Clé combinée pour éviter les conflits si le tableau a moins de 3 éléments
                            className={`relative flex flex-col items-center w-full transition-all duration-300 ${isCenter ? 'z-10 scale-105 opacity-100' : 'opacity-30 scale-95'}`}
                        >
                            {/* Carte Graphique */}
                            <div className={`relative h-36 w-full rounded-lg overflow-hidden bg-[#111113] block border ${cardBorder}`}>
                                <div className={`absolute inset-0 bg-linear-to-t via-transparent to-transparent z-10 opacity-90 ${gradientColor}`} />

                                <img
                                    src={team.logo_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80"}
                                    alt={team.nom || 'Équipe'}
                                    className="w-full h-full object-cover object-top block grayscale brightness-90 contrast-125"
                                />

                                {/* Crochet de rang (\___/) */}
                                <div className="absolute bottom-2 left-0 right-0 z-20 flex flex-col items-center">
                                    <div className="relative w-4/5 h-3 flex items-end justify-center">
                                        <div className="absolute inset-x-0 bottom-0 border-b border-x border-white/60 h-2 rounded-b-md mx-1" />
                                        <span className="relative text-[8px] font-mono font-black bg-[#070708] px-1.5 py-0 rounded text-white border border-white/10 transform translate-y-1.5">
                                            {rankDisplay}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Label Textuel sous la carte */}
                            <div className="w-full bg-[#1c1c1f] border border-[#29292e] text-center py-1 mt-3 rounded-md shadow-md overflow-hidden box-border">
                                <p className="text-[9px] font-black tracking-wider text-gray-300 font-mono uppercase truncate px-1 m-0">
                                    {team.nom || 'XXX'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Flèche Droite */}
            <button
                onClick={handleNext}
                className="absolute right-0 z-20 text-gray-500 hover:text-white transition-colors bg-[#070708]/90 rounded-full p-0.5 cursor-pointer active:scale-90"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    );
}