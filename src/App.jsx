import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home.tsx'
import Programme from './pages/Programme/Programme.tsx'
import Map from './pages/Map/Map'
import Match from './pages/Match/Match'
import Tournoi from './pages/Tournoi/Tournoi'
import Affrontement from "./pages/Programme/Affrontement.tsx";
import './App.css'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Programme />} />
        <Route path="/map" element={<Map />} />
        <Route path="/match" element={<Match />} />
        <Route path="/tournoi" element={<Tournoi />} />
        <Route path="/affrontement/:matchId" element={<Affrontement />} />
      </Routes>
      <Navbar />
    </>
  )
}

export default App
