import { useState } from 'react' // 🚀 Ajout de useState
import { useNavigate } from 'react-router-dom' // 🚀 Ajout du hook de navigation
import { UserCircle, Menu, X, Info, Home, Calendar, Map, Trophy, BarChart2 } from 'lucide-react' // 🚀 Ajout des icônes pour le menu
import { useAuth } from '../../contexts/AuthContext'
import './Header.css'

const logoUrl = 'https://www.figma.com/api/mcp/asset/9a0b07a4-2bfe-4552-9f9c-2b8c53088736'

export default function Header({ onOpenAuth }) {
    const { user, profile } = useAuth()
    const navigate = useNavigate() // 🚀 Initialisation du hook de navigation
    const [menuOpen, setMenuOpen] = useState(false) // 🚀 État pour gérer le menu Burger

    // Fonction utilitaire pour naviguer et fermer le menu proprement
    const handleNavigate = (path) => {
        navigate(path)
        setMenuOpen(false)
    }

    return (
        <>
            <header className="header relative z-50">
                <img
                    className="header-logo cursor-pointer"
                    src={logoUrl}
                    alt="Esport"
                    onClick={() => navigate('/')}
                />
                <div className="header-actions">
                    <button className="header-avatar-btn" onClick={onOpenAuth} aria-label="Compte">
                        {user ? (
                            <div className="header-avatar-initial">
                                {(profile?.pseudo || user.email)?.[0]?.toUpperCase()}
                            </div>
                        ) : (
                            <UserCircle size={28} color="#fcfcfc" />
                        )}
                    </button>

                    {/* LE BOUTON BURGER CONFIGURÉ DYNAMIQUEMENT 🚀 */}
                    <button
                        className="header-burger cursor-pointer p-1 active:scale-95 transition-transform focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        {menuOpen ? <X size={28} color="#fcfcfc" /> : <Menu size={28} color="#fcfcfc" />}
                    </button>
                </div>
            </header>

            {/* LE DRAWER (TIROIR COULISSANT) DU MENU BURGER */}
            <div
                className={`fixed inset-y-0 right-0 w-64 bg-[#0c0c0e] border-l border-gray-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out p-6 pt-24 box-border flex flex-col space-y-6 ${
                    menuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center pb-2 border-b border-gray-900">
                    <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase font-mono">Navigation</span>
                </div>

                {/* LIENS DE NAVIGATION CONNECTÉS */}
                <nav className="flex flex-col space-y-1">
                    <button
                        onClick={() => handleNavigate("/infos-pratiques")}
                        className="flex items-center gap-3 text-sm font-black text-[#ff4655] p-3 rounded-xl bg-[#ff4655]/5 border border-[#ff4655]/15 w-full text-left cursor-pointer hover:bg-[#ff4655]/10 transition-colors"
                    >
                        <Info size={18} /> Infos Pratiques
                    </button>

                    <button onClick={() => handleNavigate("/map")} className="flex items-center gap-3 text-sm font-bold text-gray-300 hover:text-white p-3 rounded-xl hover:bg-white/5 bg-transparent border-none w-full text-left cursor-pointer transition-colors">
                        <Map size={18} className="text-gray-400" /> Carte du Stand
                    </button>

                    <button onClick={() => handleNavigate("/stats")} className="flex items-center gap-3 text-sm font-bold text-gray-300 hover:text-white p-3 rounded-xl hover:bg-white/5 bg-transparent border-none w-full text-left cursor-pointer transition-colors">
                        <BarChart2 size={18} className="text-gray-400" /> Statistiques
                    </button>
                </nav>
            </div>

            {/* ANRI-BACKGROUND (OVERLAY) : Assombrit le reste de l'application quand le menu est ouvert */}
            {menuOpen && (
                <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
                />
            )}
        </>
    )
}