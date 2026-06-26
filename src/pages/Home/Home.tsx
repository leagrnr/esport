import { useState, useEffect } from 'react';
import { supabase } from '../../lib/SupabaseClient';
import type { Database } from '../../types/supabase';
import {CountdownBanner} from '../../components/Accueil/CountdownBannner.tsx'
import {TeamCarousel} from "../../components/Accueil/TeamCarousel.tsx";
import {BookIcon, ChevronIcon} from "../../components/Accueil/Icon.tsx";


type EquipeRow = Database['public']['Tables']['equipe']['Row'];

// Mocks conservés en secours si tes tables distantes sont vides
const MOCK_EQUIPES_VALO: EquipeRow[] = [
    { id: 1, nom: "SOLARY", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80", jeu_id : 2, initial : "SLY" },
    { id: 2, nom: "KCORP", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80", jeu_id: 2, initial: "KC" },
    { id: 3, nom: "VITALITY", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80", jeu_id : 2, initial : "VIT" },
];

const MOCK_EQUIPES_LOL: EquipeRow[] = [
    { id: 4, nom: "MANE", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80", jeu_id : 1, initial : "MAN" },
    { id: 5, nom: "G0", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80", jeu_id : 1, initial : "G0" },
    { id: 6, nom: "BDSA", logo_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80", jeu_id : 1, initial : "BDSA" },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState<'Valorant' | 'League of Legends'>('Valorant');
    const [teams, setTeams] = useState<EquipeRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        async function loadTeams() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('equipe')
                    .select(`
                        id,
                        nom,
                        logo_url,
                        jeu_id,
                        initial,
                        participation!inner (
                            match!inner (
                                jeu!inner ( nom )
                            )
                        )
                    `)
                    .ilike('participation.match.jeu.nom', activeTab);

                if (error) throw error;

                if (data && data.length > 0) {
                    const formattedTeams: EquipeRow[] = data.map(item => ({
                        id: item.id,
                        nom: item.nom,
                        logo_url: item.logo_url,
                        jeu_id: item.jeu_id,
                        initial: item.initial
                    }));

                    const uniqueTeams = formattedTeams.filter((value, index, self) =>
                        self.findIndex(t => t.id === value.id) === index
                    );

                    setTeams(uniqueTeams);
                } else {
                    setTeams(activeTab === 'Valorant' ? MOCK_EQUIPES_VALO : MOCK_EQUIPES_LOL);
                }
            } catch (err) {
                console.error("Erreur de récupération Supabase, bascule sur les mocks :", err);
                setTeams(activeTab === 'Valorant' ? MOCK_EQUIPES_VALO : MOCK_EQUIPES_LOL);
            } finally {
                setLoading(false);
            }
        }

        loadTeams();
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

                {/* 2. LIVE TWITCH */}
                <section className="w-full space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-pulse shrink-0" />
                        <h2 className="text-xl font-black tracking-wide uppercase m-0">Live</h2>
                    </div>
                    <div className="w-full rounded-xl overflow-hidden border border-[#1e1e1e]" style={{ aspectRatio: '16/9' }}>
                        <iframe
                            src={`https://player.twitch.tv/?channel=lyonesporttv&parent=${window.location.hostname}&autoplay=true&muted=true`}
                            allowFullScreen
                            allow="autoplay"
                            className="w-full h-full"
                            title="Twitch Live – LyonEsportTV"
                        />
                    </div>
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

                    {/* Zone du carrousel sécurisée avec un loader */}
                    <div className="w-full block overflow-hidden pt-2 pb-5">
                        {loading ? (
                            <div className="flex items-center justify-center min-h-36 text-xs text-gray-500 animate-pulse font-mono tracking-widest uppercase">
                                Synchronisation...
                            </div>
                        ) : (
                            <TeamCarousel teams={teams} game={activeTab} />
                        )}
                    </div>
                </section>

                {/* 4. SECTION RÈGLES D'INTRODUCTION */}
                <section className="space-y-4 w-full block">
                    <div className="flex items-start gap-2.5">
                        <div className="mt-1 shrink-0">
                            <BookIcon />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-black tracking-wide uppercase m-0">Règle d'introduction</h2>
                            <p className="text-[10px] text-gray-400 font-medium leading-tight">
                                Tu n'as jamais regardé de e-sport ? Pas de problème, on t'explique tout
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
