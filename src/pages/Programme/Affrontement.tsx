import { useState, useEffect } from 'react';
import { supabase } from '../../lib/SupabaseClient';
import { useParams, useNavigate } from 'react-router-dom'; // 🚀 Ajout de useParams pour lire l'URL
import type { Database } from '../../types/supabase';

type EquipeRow = Database['public']['Tables']['equipe']['Row'];
type MatchRow = Database['public']['Tables']['match']['Row'];

interface AffrontementProps {
    matchId?: number; // Conservé si passé en prop directe
    onBack?: () => void;
}

export default function Affrontement({ matchId, onBack }: AffrontementProps) {
    const { matchId: matchIdParam } = useParams<{ matchId: string }>();
    const navigate = useNavigate();

    const currentProgrammeId = matchId || Number(matchIdParam);

    const [loading, setLoading] = useState<boolean>(true);
    const [eventInfo, setEventInfo] = useState<any | null>(null);
    const [matchTableInfo, setMatchTableInfo] = useState<MatchRow | null>(null);
    const [team1, setTeam1] = useState<EquipeRow | null>(null);
    const [team2, setTeam2] = useState<EquipeRow | null>(null);
    const [votedFor, setVotedFor] = useState<number | 'EGALITE' | null>(null);

    useEffect(() => {
        async function fetchEventAndMatchDetails() {
            setLoading(true);
            try {
                // 1. Récupération des infos depuis la table programme
                const { data: progData, error: progError } = await supabase
                    .from('programme')
                    .select(`
                    *,
                    equipe1:equipe1_id ( * ),
                    equipe2:equipe2_id ( * )
                `)
                    .eq('id', currentProgrammeId)
                    .single();

                if (progError) throw progError;

                if (progData) {
                    const programmeData = progData as any;

                    setEventInfo(programmeData);
                    setTeam1(programmeData.equipe1);
                    setTeam2(programmeData.equipe2);

                    // 2. Identification du match par "where equipe1_id && equipe2_id"
                    if (programmeData.type === "Match" && programmeData.equipe1_id && programmeData.equipe2_id) {
                        const { data: matchData } = await supabase
                            .from('match')
                            .select('*')
                            .eq('jeu_id', programmeData.jeu_id)
                            .eq('equipe1_id', programmeData.equipe1_id)
                            .eq('equipe2_id', programmeData.equipe2_id)
                            .maybeSingle();

                        if (matchData) {
                            setMatchTableInfo(matchData);
                        }
                    }
                }
            } catch (err) {
                console.error("Erreur de récupération des données :", err);
            } finally {
                setLoading(false);
            }
        }

        fetchEventAndMatchDetails();
    }, [currentProgrammeId]);

    const handleVote = async (choice: number | 'EGALITE') => {
        setVotedFor(choice);

        // 🛡️ SÉCURITÉ PRONOSTIC : On utilise l'ID réel de la table "match" trouvé par la recherche
        const realMatchId = matchTableInfo?.id || currentProgrammeId;

        try {
            await supabase
                .from('pronostic')
                .insert({
                    match_id: realMatchId,
                    equipe_choisie: choice === 'EGALITE' ? null : choice,
                    utilisateur_id: 1
                });
        } catch (err) {
            console.error("Erreur lors de l'enregistrement du pronostic :", err);
        }
    };

    const renderDynamicTitle = () => {
        if (!eventInfo) return "Chargement...";

        if (eventInfo.type === "Match") {
            const gameLabel = eventInfo.jeu_id === 2 ? 'Valorant' : 'League of Legends';
            return `${gameLabel} : ${eventInfo.description || "Match"}`;
        }
        return eventInfo.description || "Événement";
    };

    const isValo = eventInfo?.jeu_id === 2;
    const themeColor = isValo ? '#ff4655' : '#c8aa6e';
    const bgGradient = isValo ? 'from-[#4a080c] to-[#121214]' : 'from-[#c8aa6e]/30 to-[#121214]';
    const borderTheme = isValo ? 'border-[#ff4655]' : 'border-[#c8aa6e]';
    const characterImg = isValo
        ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80'
        : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80';

    const handleBackAction = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1); // Retour à la page précédente de l'historique si aucun callback fourni
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#070708] flex items-center justify-center font-mono text-xs tracking-widest text-gray-500 uppercase">
                Chargement de l'affrontement...
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full bg-[#070708] text-white pb-24 font-sans overflow-x-hidden box-border">

            {/* HEADER DE LA PAGE REPARE */}
            <div className="w-full max-w-sm mx-auto px-4 mt-6 flex justify-between items-center box-border border-b border-gray-900 pb-4">
                <div className="space-y-1 flex-1 pr-4 text-left">
                    <p className="text-xl font-black tracking-wider uppercase m-0 leading-tight text-gray-100">
                        {renderDynamicTitle()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[11px] font-mono text-gray-400 m-0">
                            {eventInfo?.date_heure ? new Date(eventInfo.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '11h30'}
                        </p>
                        <span className="text-gray-700 text-[10px]">•</span>
                        <p className="text-[10px] text-gray-400 font-medium m-0 uppercase tracking-wide truncate max-w-45">
                            📍 {eventInfo?.lieu || 'Halle Tony Garnier'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleBackAction}
                    className="px-3 py-0.5 text-[11px] font-bold rounded-md border border-gray-800 bg-[#121214] text-gray-400 cursor-pointer hover:text-white transition-colors flex items-center gap-1 shrink-0 active:scale-95"
                >
                    <span>←</span> Retour
                </button>
            </div>

            {/* MESSAGE COMPLÉMENTAIRE : STATUT - PHASE */}
            {eventInfo?.type === "Match" && (
                <div className="w-full max-w-sm mx-auto px-4 mt-4 box-border text-left">
                    <span className="inline-block bg-[#121214] border border-[#212124] text-[#ff4655] font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md" style={{ color: themeColor }}>
                        {matchTableInfo?.statut || 'À VENIR'} — {matchTableInfo?.phase || 'TOURNOI'}
                    </span>
                </div>
            )}

            {/* ZONE CENTRALE DES BANNERS DE COMBAT */}
            <div className="w-full max-w-sm mx-auto px-4 mt-4 flex flex-col relative space-y-3 box-border">

                {/* BANNER 1 : ÉQUIPE DU HAUT */}
                <div
                    onClick={() => handleVote(team1?.id || 10)}
                    className={`relative h-36 w-full rounded-xl overflow-hidden cursor-pointer border transition-all ${votedFor === team1?.id ? `border-2 ${borderTheme} scale-[1.01]` : 'border-transparent'}`}
                >
                    <div className={`absolute inset-0 bg-linear-to-r ${bgGradient} z-10 opacity-95`} />
                    <img src={characterImg} alt="Character Art" className="absolute right-0 top-0 h-full w-2/3 object-cover grayscale brightness-70 contrast-125 z-0" />

                    <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between box-border">
                        <span className="text-right text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">{isValo ? `Valorant` : `League of Legends`}</span>
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col text-[10px] text-gray-400 font-mono">
                                <span>Pronostics</span>
                                <span className="text-white/80 font-bold">Stand XX</span>
                            </div>
                            <h3 className="text-lg font-black tracking-wide uppercase m-0">{team1?.nom || 'Équipe XX'}</h3>
                        </div>
                    </div>
                </div>

                {/* LOGO "VS" INTERMÉDIAIRE */}
                <div className="absolute left-1/2 top-[50%] transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <span className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] select-none">
                        VS
                    </span>
                </div>

                {/* BANNER 2 : ÉQUIPE DU BAS */}
                <div
                    onClick={() => handleVote(team2?.id || 11)}
                    className={`relative h-36 w-full rounded-xl overflow-hidden cursor-pointer border transition-all ${votedFor === team2?.id ? `border-2 ${borderTheme} scale-[1.01]` : 'border-transparent'}`}
                >
                    <div className={`absolute inset-0 bg-linear-to-l ${bgGradient} z-10 opacity-95`} />
                    <img src={characterImg} alt="Character Art" className="absolute left-0 top-0 h-full w-2/3 object-cover scale-x-[-1] grayscale brightness-70 contrast-125 z-0" />

                    <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between box-border">
                        <span className="text-left text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">{isValo ? `Valorant` : `League of Legends`} </span>
                        <div className="flex justify-between items-end flex-row-reverse">
                            <div className="flex flex-col text-[10px] text-gray-400 font-mono text-right">
                                <span>Pronostics</span>
                                <span className="text-white/80 font-bold">Stand XX</span>
                            </div>
                            <h3 className="text-lg font-black tracking-wide uppercase m-0">{team2?.nom || 'Équipe XX'}</h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* SCORE DISPLAY (Intégré juste au-dessus des prédictions) */}
            {eventInfo?.type === "Match" && (
                <div className="w-full max-w-sm mx-auto px-4 mt-6 box-border text-center">
                    <div className="bg-[#121214] border border-[#212124] rounded-xl py-2.5 px-4 flex flex-col items-center justify-center space-y-1 max-w-35 mx-auto shadow-md">
                        <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase font-sans">Score</span>
                        <span className="text-2xl font-black font-mono tracking-wider text-white">
                            {matchTableInfo?.score || '0 - 0'}
                        </span>
                    </div>
                </div>
            )}

            {/* CAPSULE DE PRÉDICTION */}
            <div className="w-full max-w-sm mx-auto px-4 mt-6 flex flex-col space-y-3 box-border">

                <div className="flex justify-between items-center px-1">
                    <h4 className="text-[11px] font-black tracking-widest text-gray-400 uppercase font-sans">
                        Qui va gagner ?
                    </h4>
                    <span className="text-[11px] font-mono text-gray-400 font-bold tracking-wide">
                        19,917 votes
                    </span>
                </div>

                <div className="w-full h-14 bg-[#121214] border border-[#212124] rounded-full p-1 flex items-center justify-between relative overflow-hidden box-border select-none shadow-2xl">

                    {/* SEGMENT 1 : ÉQUIPE 1 */}
                    <button
                        onClick={() => handleVote(team1?.id || 10)}
                        className={`flex-1 h-full flex items-center justify-center gap-2 rounded-l-full transition-all cursor-pointer relative ${votedFor === team1?.id ? 'bg-white/5 font-black' : 'hover:bg-white/2'}`}
                    >
                        {votedFor === team1?.id && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ backgroundColor: themeColor }} />
                        )}

                        {team1?.logo_url ? (
                            <img src={team1.logo_url} alt={team1.nom || ''} className="w-6 h-6 object-contain rounded-full" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-mono font-black">
                                {team1?.initial || 'KC'}
                            </div>
                        )}
                        <span className="text-[11px] font-mono tracking-wider font-black uppercase text-gray-200">
                            {team1?.nom || 'KARMINE CORP'}
                        </span>
                    </button>

                    <div className="w-px h-5 bg-gray-800/60 shrink-0" />

                    {/* SEGMENT 2 : ÉGALITÉ */}
                    <button
                        onClick={() => handleVote('EGALITE')}
                        className={`flex-1 h-full flex items-center justify-center transition-all cursor-pointer ${votedFor === 'EGALITE' ? 'bg-white/5 font-black text-white' : 'hover:bg-white/2 text-gray-400'}`}
                    >
                        <span className="text-[10px] font-black tracking-widest font-mono uppercase">
                            Égalité
                        </span>
                    </button>

                    <div className="w-px h-5 bg-gray-800/60 shrink-0" />

                    {/* SEGMENT 3 : ÉQUIPE 2 */}
                    <button
                        onClick={() => handleVote(team2?.id || 11)}
                        className={`flex-1 h-full flex items-center justify-center gap-2 rounded-r-full transition-all cursor-pointer relative ${votedFor === team2?.id ? 'bg-white/5 font-black' : 'hover:bg-white/2'}`}
                    >
                        {votedFor === team2?.id && (
                            <div className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full" style={{ backgroundColor: themeColor }} />
                        )}

                        <span className="text-[11px] font-mono tracking-wider font-black uppercase text-gray-200">
                            {team2?.nom || 'SOLARY'}
                        </span>

                        {team2?.logo_url ? (
                            <img src={team2.logo_url} alt={team2.nom || ''} className="w-6 h-6 object-contain rounded-full" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-mono font-black">
                                {team2?.initial || 'SLY'}
                            </div>
                        )}
                    </button>

                </div>

                <p className="text-[9px] text-gray-500 font-medium text-center pt-1">
                    Choisis ton camp en cliquant directement sur l'une des zones de la barre.
                </p>
            </div>

        </main>
    );
}