import { UserCircle, Menu } from 'lucide-react'
import './Header.css'

const logoUrl = 'https://www.figma.com/api/mcp/asset/9a0b07a4-2bfe-4552-9f9c-2b8c53088736'

export default function Header() {
  return (
    <header className="header">
      <img className="header-logo" src={logoUrl} alt="Esport" />
      <div className="header-actions">
        <UserCircle className="header-avatar" size={28} color="#fcfcfc" />
        <button className="header-burger" aria-label="Menu">
          <Menu size={28} color="#fcfcfc" />
        </button>
      </div>
    </header>
  )
}
