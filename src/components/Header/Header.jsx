import { UserCircle, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import './Header.css'

const logoUrl = 'https://www.figma.com/api/mcp/asset/9a0b07a4-2bfe-4552-9f9c-2b8c53088736'

export default function Header({ onOpenAuth }) {
  const { user, profile } = useAuth()

  return (
    <header className="header">
      <img className="header-logo" src={logoUrl} alt="Esport" />
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
        <button className="header-burger" aria-label="Menu">
          <Menu size={28} color="#fcfcfc" />
        </button>
      </div>
    </header>
  )
}
