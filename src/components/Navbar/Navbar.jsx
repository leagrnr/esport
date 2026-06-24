import { NavLink } from 'react-router-dom'
import { Home, Calendar, Map, Trophy } from 'lucide-react'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/agenda', label: 'Agenda', Icon: Calendar },
  { to: '/map', label: 'Map', Icon: Map },
  { to: '/match', label: 'Match', Icon: Trophy },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      {links.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <div className="nav-icon-wrapper">
            <Icon size={24} className="nav-icon" />
          </div>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
