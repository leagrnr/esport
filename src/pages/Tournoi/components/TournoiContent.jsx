import { useState } from 'react'
import { useTeamStats } from '../../../hooks/useTeamStats'
import './TournoiContent.css'

const GAME_FILTERS = ['Tous', 'LoL', 'Valo']

function GameHeader({ game }) {
  return (
    <div className={`game-section-header game-section-header--${game}`}>
      <span className="game-section-dot" />
      <span className="game-section-name">{game === 'lol' ? 'League of Legends' : 'Valorant'}</span>
      <span className="game-section-line" />
    </div>
  )
}

function TeamRow({ team }) {
  return (
    <div className="swiss-team-row">
      {team.logo_url
        ? <img  className="swiss-logo" src={team.logo_url} alt={team.nom} />
        : <span className="swiss-logo swiss-logo--placeholder" />
      }
      <span className="swiss-name">{team.nom}</span>
      <span className="swiss-wl">{team.wins}V – {team.losses}D</span>
    </div>
  )
}

function BracketGroup({ record, teams }) {
  if (teams.length === 0) return null
  return (
    <div className="swiss-bracket">
      <span className="swiss-bracket-tag">{record}</span>
      <div className="swiss-matches">
        {teams.map(t => <TeamRow key={t.id} team={t} />)}
      </div>
    </div>
  )
}

export default function TournoiContent() {
  const [gameFilter, setGameFilter] = useState('Tous')
  const { teams, loading } = useTeamStats()

  const filtered = teams.filter(t => {
    if (gameFilter === 'LoL')  return t.jeu_id === 1
    if (gameFilter === 'Valo') return t.jeu_id === 2
    return true
  })

  // Grouper par record W-L
  const groups = {}
  filtered.forEach(t => {
    const key = `${t.wins}-${t.losses}`
    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  })

  const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
    const [aw, al] = a.split('-').map(Number)
    const [bw, bl] = b.split('-').map(Number)
    return bw - aw || al - bl
  })

  const qualified  = filtered.filter(t => t.wins >= 3 && t.losses < 3)
  const eliminated = filtered.filter(t => t.losses >= 3)

  const lolTeams  = filtered.filter(t => t.jeu_id === 1)
  const valoTeams = filtered.filter(t => t.jeu_id === 2)
  const showBoth  = gameFilter === 'Tous'

  function renderGroups(teamList) {
    const g = {}
    teamList.forEach(t => {
      const key = `${t.wins}-${t.losses}`
      if (!g[key]) g[key] = []
      g[key].push(t)
    })
    return Object.entries(g)
      .sort(([a], [b]) => {
        const [aw, al] = a.split('-').map(Number)
        const [bw, bl] = b.split('-').map(Number)
        return bw - aw || al - bl
      })
      .map(([record, ts]) => <BracketGroup key={record} record={record} teams={ts} />)
  }

  return (
    <div className="tournoi-content">
      <div className="tournoi-subfilters">
        {GAME_FILTERS.map(f => (
          <button
            key={f}
            className={`tournoi-subfilter${gameFilter === f ? ' active' : ''}`}
            onClick={() => setGameFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="tournoi-empty">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="tournoi-empty">Aucune équipe.</p>
      ) : (
        <>
          {showBoth ? (
            <>
              {lolTeams.length > 0 && (
                <>
                  <GameHeader game="lol" />
                  {renderGroups(lolTeams)}
                </>
              )}
              {valoTeams.length > 0 && (
                <>
                  <GameHeader game="valo" />
                  {renderGroups(valoTeams)}
                </>
              )}
            </>
          ) : (
            renderGroups(filtered)
          )}

          {qualified.length > 0 && (
            <div className="swiss-status swiss-status--qualified">
              <span className="swiss-status-label">✓ Qualifiés ({qualified.length})</span>
              <div className="swiss-status-teams">
                {qualified.map(t => (
                  <span key={t.id} className="swiss-status-team">{t.nom}</span>
                ))}
              </div>
            </div>
          )}

          {eliminated.length > 0 && (
            <div className="swiss-status swiss-status--eliminated">
              <span className="swiss-status-label">✕ Éliminés ({eliminated.length})</span>
              <div className="swiss-status-teams">
                {eliminated.map(t => (
                  <span key={t.id} className="swiss-status-team">{t.nom}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
