import React, { useState, useEffect } from 'react';
import type { Database } from '../../types/supabase';

type EquipeRow = Database['public']['Tables']['equipe']['Row'];

const MOCK_EQUIPES_VALO: EquipeRow[] = [
    { id: 1, nom: "SOLARY", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80" },
    { id: 2, nom: "KCORP", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80" },
    { id: 3, nom: "VITALITY", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80" },
];

const MOCK_EQUIPES_LOL: EquipeRow[] = [
    { id: 4, nom: "MANE", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80" },
    { id: 5, nom: "G0", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80" },
    { id: 6, nom: "BDSA", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80" },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState<'Valorant' | 'League of Legends'>('Valorant');
    const [teams, setTeams] = useState<EquipeRow[]>(MOCK_EQUIPES_VALO);

    // État pour gérer l'ouverture des volets de règles ('lol' | 'valo' | 'vocab' | null)
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        setTeams(activeTab === 'Valorant' ? MOCK_EQUIPES_VALO : MOCK_EQUIPES_LOL);
    }, [activeTab]);

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <main className="min-h-screen w-full bg-[#070708] text-white pb-32 font-sans overflow-x-hidden box-border">

            {/* 1. COMPTE À REBOURS */}
            <CountdownBanner targetDate="2026-09-15T10:00:00" />

            {/* Cadre global de l'application mobile */}
            <div className="w-full max-w-sm mx-auto px-4 mt-6 flex flex-col space-y-8 box-border">

                {/* 2. CARTES D'ACTION RAPIDE */}
                <section className="grid grid-cols-2 gap-3 w-full box-border">
                    <ActionCard
                        title="Pronostics"
                        description="Joue avec tes amis dès maintenant"
                        icon={<TrophyIcon />}
                    />
                    <ActionCard
                        title="Associe ton pass"
                        description="Compte gratuit + QR code d’entrée"
                        icon={<SparklesIcon />}
                    />
                </section>

                {/* 3. SECTION ÉQUIPES */}
                <section className="space-y-4 w-full block overflow-hidden">
                    <h2 className="text-xl font-black tracking-wide uppercase m-0">Équipe en lice</h2>

                    {/* Onglets de jeux */}
                    <div className="flex gap-2 w-full justify-center">
                        <button
                            onClick={() => setActiveTab('Valorant')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-all ${activeTab === 'Valorant' ? 'bg-[#ff4655] text-white border border-[#ff4655]' : 'bg-[#141416] text-gray-400 border border-[#262629]'}`}
                        >
                            Valo
                        </button>
                        <button
                            onClick={() => setActiveTab('League of Legends')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-all ${activeTab === 'League of Legends' ? 'bg-[#c8aa6e] text-white border border-[#c8aa6e]' : 'bg-[#141416] text-gray-400 border border-[#262629]'}`}
                        >
                            LoL
                        </button>
                    </div>

                    {/* Zone du carrousel */}
                    <div className="w-full block overflow-hidden pt-2 pb-5">
                        <TeamCarousel teams={teams} game={activeTab} />
                    </div>
                </section>

                {/* 4. SECTION RÈGLES D'INTRODUCTION */}
                <section className="space-y-4 w-full block">
                    <div className="flex items-start gap-2.5">
                        <div className="mt-1 shrink-0">
                            <BookIcon />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-black tracking-wide uppercase m-0">Règle d’introduction</h2>
                            <p className="text-[10px] text-gray-400 font-medium leading-tight">
                                Tu n’as jamais regardé de e-sport ? Pas de problème, on t’explique tout
                            </p>
                        </div>
                    </div>

                    {/* Liste des Accordions */}
                    <div className="space-y-3 pt-2">

                        {/* Accordion 1: LEAGUE OF LEGENDS */}
                        <div className={`bg-[#121214] rounded-xl border transition-colors duration-200 ${openAccordion === 'lol' ? 'border-[#c8aa6e]' : 'border-[#212124]'}`}>
                            <button
                                onClick={() => toggleAccordion('lol')}
                                className="w-full flex justify-between items-center p-4 cursor-pointer text-left focus:outline-none"
                            >
                                <span className="text-xs font-black tracking-wider uppercase font-mono">League of Legends</span>
                                <ChevronIcon isOpen={openAccordion === 'lol'} />
                            </button>
                            {openAccordion === 'lol' && (
                                <div className="px-4 pb-5 text-[11px] text-gray-300 space-y-3 font-medium leading-relaxed border-t border-[#1a1a1c] pt-3">
                                    <p className="font-bold text-white">MOBA 5 contre 5. Objectif : détruire le « Nexus » adverse au fond de sa base.</p>
                                    <ul className="space-y-2.5">
                                        <li className="flex items-start gap-1.5"><span className="text-[#c8aa6e] shrink-0">»</span>La carte a 3 voies (lanes) reliant les deux bases, séparées par la jungle.</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#c8aa6e] shrink-0">»</span>Chaque joueur a un rôle : Top, Jungle, Mid, ADC (carry) et Support.</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#c8aa6e] shrink-0">»</span>On tue des sbires/monstres pour gagner de l'or et de l'expérience, puis on achète des objets.</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#c8aa6e] shrink-0">»</span>Le Baron Nashor et les Dragons sont des objectifs neutres qui donnent de gros bonus d'équipe.</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#c8aa6e] shrink-0">»</span>Match au meilleur des 3 ou 5 manches (Bo3 / Bo5) en phase finale.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Accordion 2: VALORANT */}
                        <div className={`bg-[#121214] rounded-xl border transition-colors duration-200 ${openAccordion === 'valo' ? 'border-[#ff4655]' : 'border-[#212124]'}`}>
                            <button
                                onClick={() => toggleAccordion('valo')}
                                className="w-full flex justify-between items-center p-4 cursor-pointer text-left focus:outline-none"
                            >
                                <span className="text-xs font-black tracking-wider uppercase font-mono">Valorant</span>
                                <ChevronIcon isOpen={openAccordion === 'valo'} />
                            </button>
                            {openAccordion === 'valo' && (
                                <div className="px-4 pb-5 text-[11px] text-gray-300 space-y-3 font-medium leading-relaxed border-t border-[#1a1a1c] pt-3">
                                    <p className="font-bold text-white">FPS tactique 5 contre 5. Les attaquants posent la « Spike » (bombe), les défenseurs l'empêchent.</p>
                                    <ul className="space-y-2.5">
                                        <li className="flex items-start gap-1.5"><span className="text-[#ff4655] shrink-0">•</span>Chaque round : l'attaque tente de planter et faire exploser la Spike, la défense défuse ou élimine.</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#ff4655] shrink-0">•</span>Chaque joueur choisit un « Agent » avec des compétences (smoke, flash, soin...).</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#ff4655] shrink-0">•</span>4 familles d'agents : Duelliste, Initiateur, Contrôleur, Sentinelle.</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#ff4655] shrink-0">•</span>On achète armes et compétences en début de round avec l'argent gagné.</li>
                                        <li className="flex items-start gap-1.5"><span className="text-[#ff4655] shrink-0">•</span>Première équipe à 13 rounds gagne la carte.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Accordion 3: VOCABULAIRE */}
                        <div className={`bg-[#121214] rounded-xl border transition-colors duration-200 ${openAccordion === 'vocab' ? 'border-[#ff4655]' : 'border-[#212124]'}`}>
                            <button
                                onClick={() => toggleAccordion('vocab')}
                                className="w-full flex justify-between items-center p-4 cursor-pointer text-left focus:outline-none"
                            >
                                <span className="text-xs font-black tracking-wider uppercase font-mono">Vocabulaire</span>
                                <ChevronIcon isOpen={openAccordion === 'vocab'} />
                            </button>
                            {openAccordion === 'vocab' && (
                                <div className="px-4 pb-5 text-[11px] text-gray-300 space-y-3.5 font-medium leading-relaxed border-t border-[#1a1a1c] pt-4">
                                    <div className="space-y-1">
                                        <h4 className="text-[#ff4655] font-black uppercase font-mono text-[10px]">GG</h4>
                                        <p className="text-white">« Good Game », dit en fin de partie par fair-play.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[#ff4655] font-black uppercase font-mono text-[10px]">Clutch</h4>
                                        <p className="text-white">Gagner une situation désespérée seul contre plusieurs.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[#ff4655] font-black uppercase font-mono text-[10px]">Ace</h4>
                                        <p className="text-white">Éliminer toute l'équipe adverse (5 kills) sur un round.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[#ff4655] font-black uppercase font-mono text-[10px]">Meta</h4>
                                        <p className="text-white">Les stratégies/personnages les plus forts du moment.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[#ff4655] font-black uppercase font-mono text-[10px]">Bo3 / Bo5</h4>
                                        <p className="text-white">Best of 3 / 5 : il faut gagner 2 / 3 manches.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}

// --- SOUS-COMPOSANTS ---

function CountdownBanner({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ jours: '00', heures: '00', minutes: '00', secondes: '00' });

    useEffect(() => {
        const timer = setInterval(() => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    jours: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                    heures: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
                    minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
                    secondes: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="w-full bg-[#4a080c] py-4 text-center border-b border-red-900/30 px-4 box-border">
            <p className="text-[11px] font-black tracking-[0.2em] text-red-200/90 uppercase m-0">La lan débute dans</p>
            <div className="text-xl font-black font-mono tracking-wide my-1 text-white">
                {timeLeft.jours} J : {timeLeft.heures} H : {timeLeft.minutes} M : {timeLeft.secondes} S
            </div>
            <p className="text-[10px] text-red-300/50 font-medium tracking-wide m-0">Halle Tony Garnier · Lyon</p>
        </div>
    );
}

function ActionCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
    return (
        <div className="bg-[#121214] border border-[#212124] rounded-xl p-4 flex flex-col justify-evenly h-36 w-full box-border cursor-pointer hover:border-gray-800 transition-colors">
            <div className="w-8 h-8 rounded-lg border border-[#2d2d32] bg-black/20 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="space-y-0.5">
                <h3 className="text-sm font-bold tracking-wide truncate m-0">{title}</h3>
                <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-2 m-0">{description}</p>
            </div>
        </div>
    );
}

function TeamCarousel({ teams, game }: { teams: EquipeRow[]; game: 'Valorant' | 'League of Legends' }) {

    // 2. On prépare les styles dynamiques selon le jeu actif
    const isValo = game === 'Valorant';

    const cardBorder = isValo
        ? 'border-red-950/40'
        : 'border-[#c8aa6e]/30'; // Or LoL

    const gradientColor = isValo
        ? 'from-[#360407]'
        : 'from-[#1f180e]'; // Un joli fond dégradé doré très sombre

    return (
        <div className="relative flex items-center justify-center w-full overflow-hidden min-h-50">
            {/* Flèche Gauche */}
            <button className="absolute left-0 z-20 text-gray-500 hover:text-white transition-colors bg-[#070708]/90 rounded-full p-0.5 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>

            {/* Grille */}
            <div className="grid grid-cols-3 w-full gap-2 px-5 box-border items-center">
                {teams.slice(0, 3).map((team, index) => {
                    const isCenter = index === 1;
                    const rankDisplay = isCenter ? "01" : "02";

                    return (
                        <div
                            key={team.id}
                            className={`relative flex flex-col items-center w-full transition-all duration-300 ${isCenter ? 'z-10 scale-105' : 'opacity-30 scale-95'}`}
                        >
                            {/* Le conteneur avec la bordure et le dégradé dynamiques 🚀 */}
                            <div className={`relative h-36 w-full rounded-lg overflow-hidden bg-[#111113] block border ${cardBorder}`}>
                                <div className={`absolute inset-0 bg-linear-to-t via-transparent to-transparent z-10 opacity-90 ${gradientColor}`} />

                                <img
                                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80"
                                    alt={team.nom || 'Équipe'}
                                    className="w-full h-full object-cover object-top block grayscale brightness-90 contrast-125"
                                />

                                {/* Crochet de rang */}
                                <div className="absolute bottom-2 left-0 right-0 z-20 flex flex-col items-center">
                                    <div className="relative w-4/5 h-3 flex items-end justify-center">
                                        <div className="absolute inset-x-0 bottom-0 border-b border-x border-white/60 h-2 rounded-b-md mx-1" />
                                        <span className="relative text-[8px] font-mono font-black bg-[#070708] px-1.5 py-0 rounded text-white border border-white/10 transform translate-y-1.5">
                      {rankDisplay}
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Label de l'équipe */}
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
            <button className="absolute right-0 z-20 text-gray-500 hover:text-white transition-colors bg-[#070708]/90 rounded-full p-0.5 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
        </div>
    );
}

// --- ICONS & ARROWS ---

function TrophyIcon() {
    return <svg className="w-[16px] h-[16px] text-[#ff4655]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l0 7m-6-16h12m-12 0a2 2 0 00-2 2v3a2 2 0 002 2h2m8-7a2 2 0 012 2v3a2 2 0 01-2 2h-2m-8 0h8m-4-5v5" /></svg>;
}

function SparklesIcon() {
    return <svg className="w-[16px] h-[16px] text-[#ffb800]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
}

function BookIcon() {
    return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
    return (
        <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-white' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
    );
}