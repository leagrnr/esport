import { NavLink } from "react-router-dom";
import { Home, Calendar, Sword, Trophy, Map } from "lucide-react";

const links = [
  { to: "/", label: "L'Event", Icon: Home },
  { to: "/programme", label: "Prog.", Icon: Calendar }, // Ajuste vers "/agenda" si ton ancienne route est conservée
  { to: "/pixel-war", label: "Pixel War", Icon: Sword },
  { to: "/match", label: "Prédi.", Icon: Trophy },
  { to: "/map", label: "Quêtes", Icon: Map },
];

export default function Navbar() {
  return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#121214]/90 backdrop-blur-md border-t border-[#212124] flex items-center justify-around px-2 z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.6)] box-border">
        {links.map(({ to, label, Icon }) => (
            <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                    `flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none no-underline transition-all duration-200 ${
                        isActive ? "text-[#ff4655]" : "text-gray-500 hover:text-gray-400"
                    }`
                }
            >
              {({ isActive }) => (
                  <>
                    {/* Conteneur de l'icône avec scale dynamique au clic */}
                    <div className={`relative flex items-center justify-center w-8 h-7 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                      <Icon size={20} className="transition-colors" />

                      {/* 🔴 Puce lumineuse sous l'icône active */}
                      {isActive && (
                          <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#ff4655] shadow-[0_0_8px_#ff4655]" />
                      )}
                    </div>

                    {/* Libellé de l'onglet style E-sport */}
                    <span className={`text-[9px] mt-1 font-black tracking-widest uppercase transition-colors font-sans ${isActive ? "text-white" : "text-gray-500"}`}>
                {label}
              </span>
                  </>
              )}
            </NavLink>
        ))}
      </nav>
  );
}