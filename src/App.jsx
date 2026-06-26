import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import AuthModal from './components/Auth/AuthModal'
import Home from './pages/Home/Home.tsx'
import InfosPratiques from './pages/InfosPratiques/InfosPratiques'
import Programme from './pages/Programme/Programme.tsx'
import Map from './pages/Map/Map'
import Match from './pages/Match/Match'
import Tournoi from './pages/Tournoi/Tournoi'
import Affrontement from "./pages/Programme/Affrontement.tsx"
import Admin from './pages/Admin/Admin'
import PixelWar from './pages/PixelWar/PixelWar'
import TempsChaudBanner from './components/TempsChaudBanner'
import './App.css'

function App() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <AuthProvider>
      <Header onOpenAuth={() => setAuthOpen(true)} />
      <TempsChaudBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programme" element={<Programme />} />
        <Route path="/map" element={<Map />} />
        <Route path="/match" element={<Match />} />
        <Route path="/tournoi" element={<Tournoi />} />
        <Route path="/affrontement/:matchId" element={<Affrontement />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pixel-war" element={<PixelWar />} />
        <Route path="/infos-pratiques" element={<InfosPratiques />} />
      </Routes>
      <Navbar />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </AuthProvider>
  )
}

export default App
