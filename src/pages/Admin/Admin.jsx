import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Shield, User, Users, ChevronLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import AdminMatchs from './components/AdminMatchs'
import AdminEquipes from './components/AdminEquipes'
import AdminJoueurs from './components/AdminJoueurs'
import AdminUtilisateurs from './components/AdminUtilisateurs'
import './Admin.css'

const TABS = [
  { label: 'Matchs', icon: Calendar },
  { label: 'Équipes', icon: Shield },
  { label: 'Joueurs', icon: User },
  { label: 'Utilisateurs', icon: Users },
]

export default function Admin() {
  const { profile, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState({ matchs: 0, equipes: 0, joueurs: 0, utilisateurs: 0 })

  useEffect(() => {
    async function fetchStats() {
      const [m, e, j, u] = await Promise.all([
        supabase.from('match').select('id', { count: 'exact', head: true }),
        supabase.from('equipe').select('id', { count: 'exact', head: true }),
        supabase.from('joueur').select('id', { count: 'exact', head: true }),
        supabase.from('utilisateur').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        matchs: m.count ?? 0,
        equipes: e.count ?? 0,
        joueurs: j.count ?? 0,
        utilisateurs: u.count ?? 0,
      })
    }
    fetchStats()
  }, [tab])

  if (loading) return <div className="admin-loading">Chargement…</div>

  if (!profile || profile.role !== 'admin') {
    navigate('/')
    return null
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div className="admin-header-top">
          <div className="admin-header-title-group">
            <Shield size={20} className="admin-header-icon" />
            <h1 className="admin-title">Administration</h1>
          </div>
          <button className="admin-back" onClick={() => navigate('/')}>
            <ChevronLeft size={16} />
            Retour
          </button>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-value">{stats.matchs}</span>
            <span className="admin-stat-label">Matchs</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{stats.equipes}</span>
            <span className="admin-stat-label">Équipes</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{stats.joueurs}</span>
            <span className="admin-stat-label">Joueurs</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{stats.utilisateurs}</span>
            <span className="admin-stat-label">Users</span>
          </div>
        </div>
      </div>

      <div className="admin-tabs-bar">
        {TABS.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            className={`admin-tab-btn ${tab === i ? 'admin-tab-btn--active' : ''}`}
            onClick={() => setTab(i)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === 0 && <AdminMatchs />}
      {tab === 1 && <AdminEquipes />}
      {tab === 2 && <AdminJoueurs />}
      {tab === 3 && <AdminUtilisateurs />}
    </main>
  )
}
