import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar, Clock, Copy, Check, Share2,
    TramFront, Car, Bike, Train
} from 'lucide-react';

export default function InfosPratiques() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState<boolean>(false);

    const eventDate = "Jeudi 12 Novembre 2026";
    const eventAddress = "Studio 24, 24 Rue Jean Lesire, 69100 Villeurbanne";

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(eventAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareAddress = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Studio 24 - Tech Event',
                    text: `Rejoins-moi à l'événement Tech au Studio 24 ! \n📍 Adresse : ${eventAddress}`,
                    url: window.location.origin
                });
            } catch (err) {
                console.log("Partage préventif ou annulé");
            }
        } else {
            handleCopyAddress();
        }
    };

    return (
        <main className="min-h-screen w-full bg-[#070708] text-white pb-24 font-sans overflow-x-hidden box-border">

            {/* EN-TÊTE DE LA PAGE */}
            <div className="w-full max-w-sm mx-auto px-4 mt-6 flex justify-between items-center box-border border-b border-gray-900 pb-4">
                <div className="space-y-0.5 text-left">
                    <p className="text-3xl font-black tracking-wider uppercase m-0 text-gray-100">
                        Infos Pratiques
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        Studio 24 — Tech & Événement
                    </p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-3 py-1 text-[11px] font-bold rounded-md border border-gray-800 bg-[#121214] text-gray-400 cursor-pointer hover:text-white transition-colors active:scale-95 text-nowrap"
                >
                    <span>←</span> Retour
                </button>
            </div>

            <div className="w-full max-w-sm mx-auto px-4 mt-6 flex flex-col space-y-4 box-border">

                {/* 📅 BLOC DATE & HORAIRES */}
                <div className="bg-[#121214] border border-[#212124] rounded-xl p-4 flex flex-col space-y-3 text-left">
                    <div className="flex items-center gap-2 text-[#ff4655]">
                        <Calendar size={18} />
                        <h2 className="text-xs font-black tracking-wider uppercase font-mono m-0">Date de l'événement</h2>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-white m-0">{eventDate}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                            <Clock size={12} />
                            <span>Ouverture des portes dès 09:00</span>
                        </div>
                    </div>
                </div>

                {/* 📍 BLOC LIEU AVEC ACTIONS COPIER & PARTAGER */}
                <div className="bg-[#121214] border border-[#212124] rounded-xl p-4 flex flex-col space-y-3 text-left">
                    <div className="flex items-center gap-2 text-[#ff4655]">
                        <MapPin size={18} />
                        <h2 className="text-xs font-black tracking-wider uppercase font-mono m-0">Le Lieu</h2>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-black text-white m-0">Studio 24</p>
                        <p className="text-xs text-gray-400 leading-tight m-0">{eventAddress}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 w-full box-border">
                        <button
                            onClick={handleCopyAddress}
                            className="h-9 rounded-lg border border-gray-800 bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.97]"
                        >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            <span>{copied ? "Adresse copiée !" : "Copier l'adresse"}</span>
                        </button>

                        <button
                            onClick={handleShareAddress}
                            className="h-9 rounded-lg border border-[#ff4655]/20 bg-[#ff4655]/5 hover:bg-[#ff4655]/10 text-[#ff4655] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.97]"
                        >
                            <Share2 size={14} />
                            <span>Partager l'accès</span>
                        </button>
                    </div>
                </div>

                {/* 🗺️ INTEGRATION REEL GOOGLE MAPS INTERACTIVE EN DARK MODE 🚀 */}
                <div className="bg-[#121214] border border-[#212124] rounded-xl overflow-hidden flex flex-col text-left">
                    <div className="p-4 pb-2 flex items-center gap-2 text-gray-400">
                        <span className="text-[10px] font-black tracking-widest font-mono uppercase">Carte Interactive</span>
                    </div>
                    <div className="w-full h-48 bg-gray-950 border-t border-gray-900/60 overflow-hidden relative">
                        <iframe
                            title="Google Maps Studio 24"
                            src="https://maps.google.com/maps?q=Studio%2024,%2024%20Rue%20Jean%20Lesire,%2069100%20Villeurbanne&t=&z=14&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-full border-0 opacity-85"
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            // Le filtre magique qui passe la carte en version sombre 🪄
                            style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
                        ></iframe>
                    </div>
                </div>

                {/* 🚇 BLOC MODES DE TRANSPORT */}
                <div className="bg-[#121214] border border-[#212124] rounded-xl p-4 flex flex-col space-y-4 text-left">
                    <div className="flex items-center gap-2 text-[#ff4655] pb-1 border-b border-gray-900/40">
                        <Train size={18} />
                        <h2 className="text-xs font-black tracking-wider uppercase font-mono m-0">Comment venir ?</h2>
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-black/40 rounded-lg border border-gray-900 shrink-0 text-gray-400">
                            <TramFront size={16} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-gray-200 m-0">Transports en Commun (TCL)</p>
                            <p className="text-[11px] text-gray-400 leading-normal m-0">
                                <span className="text-white font-semibold">Tram T3 / T1 :</span> Arrêt Gare de Villeurbanne ou Reconnaissance <br />
                                <span className="text-white font-semibold">Bus C3 / C11 :</span> Arrêt Grandclément (accès direct rapide depuis la Part-Dieu)
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-black/40 rounded-lg border border-gray-900 shrink-0 text-gray-400">
                            <Car size={16} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-gray-200 m-0">En Voiture (Périphérique)</p>
                            <p className="text-[11px] text-gray-400 leading-normal m-0">
                                Sortie <span className="text-white font-semibold">Porte de Grandclément</span>. Des places de stationnement et un parking public sont accessibles à proximité immédiate du Pôle Pixel.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-black/40 rounded-lg border border-gray-900 shrink-0 text-gray-400">
                            <Bike size={16} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-gray-200 m-0">Vélo'v & Mobilités Douces</p>
                            <p className="text-[11px] text-gray-400 leading-normal m-0">
                                Station Vélo'v <span className="text-white font-semibold">Place Grandclément</span>. Des arceaux de stationnement pour vélos et trottinettes sont disponibles devant le bâtiment.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}