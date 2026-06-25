import { useState } from 'react'
import { Search, X, Trophy, Target, Swords } from 'lucide-react'
import { useTeamStats } from '../../../hooks/useTeamStats'
import './ClassementContent.css'

const MEDALS  = { 1: { emoji: '🥇', color: '#FFD700' }, 2: { emoji: '🥈', color: '#C0C0C0' }, 3: { emoji: '🥉', color: '#CD7F32' } }
const FILTERS = ['Tous', 'LoL', 'Valo']

function GameHeader({ game }) {
  return (
    <div className={`game-section-header game-section-header--${game}`}>
      <span className="game-section-dot" />
      <span className="game-section-name">{game === 'lol' ? 'League of Legends' : 'Valorant'}</span>
      <span className="game-section-line" />
    </div>
  )
}

function winRate(t) {
  const total = t.wins + t.losses
  return total === 0 ? 0 : Math.round((t.wins / total) * 100)
}

function TeamProfile({ team, maxWins, onClose }) {
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 240)
  }

  const pct = maxWins === 0 ? 0 : Math.round((team.wins / maxWins) * 100)

  return (
    <div className={`profile-overlay${closing ? ' profile-overlay--closing' : ''}`} onClick={handleClose}>
      <div className="profile-card" onClick={e => e.stopPropagation()}>
        <button className="profile-close" onClick={handleClose}><X size={16} /></button>
        {team.logo_url
          ? <img className="profile-avatar" src={team.logo_url} alt={team.nom} />
          : <span className="profile-avatar" />
        }
        <p className="profile-name">{team.nom}</p>
        <p className="profile-rank">#{team.rank} · {team.jeu_id === 1 ? 'League of Legends' : 'Valorant'}</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <Trophy size={16} className="profile-stat-icon" />
            <span className="profile-stat-val">{team.wins}</span>
            <span className="profile-stat-lbl">victoires</span>
          </div>
          <div className="profile-stat">
            <Swords size={16} className="profile-stat-icon" />
            <span className="profile-stat-val">{team.losses}</span>
            <span className="profile-stat-lbl">défaites</span>
          </div>
          <div className="profile-stat">
            <Target size={16} className="profile-stat-icon" />
            <span className="profile-stat-val">{winRate(team)}%</span>
            <span className="profile-stat-lbl">win rate</span>
          </div>
        </div>
        <div className="profile-bar-bg">
          <div className="profile-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="profile-bar-lbl">{pct}% du leader</p>
      </div>
    </div>
  )
}

function PodiumCard({ team, position, maxWins, onClick }) {
  const medal = MEDALS[position]
  const pct   = maxWins === 0 ? 0 : Math.round((team.wins / maxWins) * 100)
  return (
    <div className={`podium-card podium-card--${position}`} onClick={() => onClick(team)}>
      <span className="podium-medal">{medal.emoji}</span>
      {team.logo_url
        ? <img className="podium-avatar" src={team.logo_url} alt={team.nom} />
        : <span className="podium-avatar" />
      }
      <span className="podium-name">{team.nom}</span>
      <span className="podium-pts" style={{ color: medal.color }}>{team.wins}V</span>
      <div className="podium-bar-bg">
        <div className="podium-bar-fill" style={{ width: `${pct}%`, background: medal.color }} />
      </div>
      <span className="podium-wl">{team.wins}V – {team.losses}D</span>
    </div>
  )
}

function RankRow({ team, maxWins, onClick }) {
  const pct = maxWins === 0 ? 0 : Math.round((team.wins / maxWins) * 100)
  return (
    <div className="classement-row" onClick={() => onClick(team)}>
      <span className="classement-rank">{team.rank}</span>
      {team.logo_url
        ? <img className="classement-avatar" src={team.logo_url} alt={team.nom} />
        : <span className="classement-avatar" />
      }
      <div className="classement-info">
        <span className="classement-name">{team.nom}</span>
        <div className="classement-bar-bg">
          <div className="classement-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="classement-right">
        <span className="classement-points">{team.wins}V</span>
        <span className="classement-wl-small">{team.wins}-{team.losses}</span>
      </div>
    </div>
  )
}

function rankList(list) {
  return [...list]
    .sort((a, b) => b.wins - a.wins || a.losses - b.losses || a.nom.localeCompare(b.nom))
    .map((t, i) => ({ ...t, rank: i + 1 }))
}

export default function ClassementContent() {
  const [search,     setSearch]     = useState('')
  const [gameFilter, setGameFilter] = useState('Tous')
  const [profile,    setProfile]    = useState(null)

  const { teams, loading } = useTeamStats()

  const base = teams.filter(t => {
    const gameOk = gameFilter === 'Tous' || (gameFilter === 'LoL' ? t.jeu_id === 1 : t.jeu_id === 2)
    const nameOk = t.nom.toLowerCase().includes(search.toLowerCase())
    return gameOk && nameOk
  })

  const ranked   = rankList(base)
  const maxWins  = ranked[0]?.wins ?? 0
  const showAll  = gameFilter === 'Tous'
  const podium   = ranked.slice(0, 3)
  const rest     = ranked.slice(3)

  const lolRanked  = rankList(ranked.filter(t => t.jeu_id === 1))
  const valoRanked = rankList(ranked.filter(t => t.jeu_id === 2))
  const lolMax     = lolRanked[0]?.wins  ?? 0
  const valoMax    = valoRanked[0]?.wins ?? 0

  return (
    <div className="classement">
      {profile && (
        <TeamProfile
          team={profile}
          maxWins={maxWins}
          onClose={() => setProfile(null)}
        />
      )}

      <p className="classement-subtitle">Classement des équipes</p>

      <div className="classement-search-wrap">
        <Search size={15} className="classement-search-icon" />
        <input
          className="classement-search"
          placeholder="Rechercher une équipe…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="classement-search-clear" onClick={() => setSearch('')}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className="classement-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`classement-filter${gameFilter === f ? ' active' : ''}`}
            onClick={() => setGameFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="classement-empty">Chargement…</p>
      ) : ranked.length === 0 ? (
        <p className="classement-empty">Aucune équipe trouvée.</p>
      ) : showAll ? (
        <>
          {lolRanked.length > 0 && (
            <>
              <GameHeader game="lol" />
              {lolRanked.slice(0, 3).length > 0 && (
                <div className="podium">
                  {lolRanked[1] && <PodiumCard team={lolRanked[1]} position={2} maxWins={lolMax} onClick={setProfile} />}
                  {lolRanked[0] && <PodiumCard team={lolRanked[0]} position={1} maxWins={lolMax} onClick={setProfile} />}
                  {lolRanked[2] && <PodiumCard team={lolRanked[2]} position={3} maxWins={lolMax} onClick={setProfile} />}
                </div>
              )}
              <div className="classement-list">
                {lolRanked.slice(3).map(t => (
                  <RankRow key={t.id} team={t} maxWins={lolMax} onClick={setProfile} />
                ))}
              </div>
            </>
          )}
          {valoRanked.length > 0 && (
            <>
              <GameHeader game="valo" />
              {valoRanked.slice(0, 3).length > 0 && (
                <div className="podium">
                  {valoRanked[1] && <PodiumCard team={valoRanked[1]} position={2} maxWins={valoMax} onClick={setProfile} />}
                  {valoRanked[0] && <PodiumCard team={valoRanked[0]} position={1} maxWins={valoMax} onClick={setProfile} />}
                  {valoRanked[2] && <PodiumCard team={valoRanked[2]} position={3} maxWins={valoMax} onClick={setProfile} />}
                </div>
              )}
              <div className="classement-list">
                {valoRanked.slice(3).map(t => (
                  <RankRow key={t.id} team={t} maxWins={valoMax} onClick={setProfile} />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {podium.length > 0 && (
            <div className="podium">
              {podium[1] && <PodiumCard team={podium[1]} position={2} maxWins={maxWins} onClick={setProfile} />}
              {podium[0] && <PodiumCard team={podium[0]} position={1} maxWins={maxWins} onClick={setProfile} />}
              {podium[2] && <PodiumCard team={podium[2]} position={3} maxWins={maxWins} onClick={setProfile} />}
            </div>
          )}
          <div className="classement-list">
            {rest.map(t => (
              <RankRow key={t.id} team={t} maxWins={maxWins} onClick={setProfile} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
