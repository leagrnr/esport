import { useState } from 'react'
import { Search, X, Flame } from 'lucide-react'
import MatchCard from './components/MatchCard'
import TournoiContent from '../Tournoi/components/TournoiContent'
import ClassementContent from './components/ClassementContent'
import { useMatches } from '../../hooks/useMatches'
import { usePronostics } from '../../hooks/usePronostics'
import { useAuth } from '../../contexts/AuthContext'
import { soumettrePronositc } from '../../lib/pixelWar'
import './Match.css'

const TABS           = ['Mes paris', 'Tableau', 'Résultats']
const GAME_FILTERS   = ['Tous', 'LoL', 'Valo']
const STATUS_FILTERS = [
  { key: 'tous',     label: 'Tous' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'a_venir',  label: 'À venir' },
  { key: 'termine',  label: 'Terminés' },
]

function GameHeader({ game }) {
  return (
    <div className={`game-section-header game-section-header--${game}`}>
      <span className="game-section-dot" />
      <span className="game-section-name">{game === 'lol' ? 'League of Legends' : 'Valorant'}</span>
      <span className="game-section-line" />
    </div>
  )
}

export default function Match() {
  const [activeTab, setActiveTab]   = useState(0)
  const [pending, setPending]       = useState({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [gameFilter,   setGameFilter]   = useState('Tous')
  const [statusFilter, setStatusFilter] = useState('tous')
  const [chaudOnly,    setChaudOnly]    = useState(false)
  const [search,       setSearch]       = useState('')

  const { matches, loading }    = useMatches()
  const { profile }             = useAuth()
  const { byMatch, loading: loadingPronos } = usePronostics(profile?.id, refreshKey)

  const canVote = profile?.role === 'spectateur' && !!profile?.camp
  const noVoteReason = !profile ? 'connexion' : !profile.camp ? 'camp' : null

  async function confirmVote(matchId) {
    if (!canVote) return
    const team  = pending[matchId]
    const match = matches.find(m => m.id === matchId)
    if (!match || !team) return

    const equipeId = team === 'team1' ? match.equipe1_id : match.equipe2_id

    try {
      await soumettrePronositc(profile.id, matchId, equipeId)
      setRefreshKey(k => k + 1)
    } catch (e) {
      if (!e.message?.includes('duplicate')) console.error(e)
    }

    setPending(prev => { const n = { ...prev }; delete n[matchId]; return n })
  }

  function cancelVote(matchId) {
    setPending(prev => { const n = { ...prev }; delete n[matchId]; return n })
  }

  function getSelected(match) {
    const p = byMatch[match.id]
    if (!p) return undefined
    return p.equipe_gagnante_id === match.equipe1_id ? 'team1' : 'team2'
  }

  function getBetResult(match) {
    const p = byMatch[match.id]
    if (!p) return null
    return { correct: p.est_correct, points: p.points_gagnes }
  }

  const q = search.toLowerCase().trim()
  const filtered = matches.filter(m => {
    const gameOk   = gameFilter === 'Tous' || (gameFilter === 'LoL' ? m.game === 'lol' : m.game === 'valo')
    const statusOk = statusFilter === 'tous' || m.statut === statusFilter
    const searchOk = !q || m.team1.toLowerCase().includes(q) || m.team2.toLowerCase().includes(q)
    const chaudOk  = !chaudOnly || m.tempsChaud
    return gameOk && statusOk && searchOk && chaudOk
  })

  const lolMatches  = filtered.filter(m => m.game === 'lol')
  const valoMatches = filtered.filter(m => m.game === 'valo')
  const showBoth    = gameFilter === 'Tous'

  const pronostiquesCount = Object.keys(byMatch).length
  const pointsTotal = Object.values(byMatch).reduce((acc, p) => acc + (p.points_gagnes ?? 0), 0)

  function renderCards(list) {
    return list.map((match) => (
      <MatchCard
        key={match.id}
        match={match}
        selected={getSelected(match)}
        betResult={getBetResult(match)}
        pending={canVote ? pending[match.id] : undefined}
        noVoteReason={noVoteReason}
        onVote={(team) => canVote && setPending(prev => ({ ...prev, [match.id]: team }))}
        onConfirm={() => confirmVote(match.id)}
        onCancel={() => cancelVote(match.id)}
      />
    ))
  }

  return (
    <main className="match-page">
      <div className="score-card">
        <div className="score-left">
          <span className="score-label">Mon score</span>
          <span className="score-value">{pointsTotal} <span className="score-unit">pts</span></span>
        </div>
        <span className="score-won">{pronostiquesCount} pari(s) placé(s)</span>
      </div>

      <div className="pronos-tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`pronos-tab${activeTab === i ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <>
          <div className="match-search-wrap">
            <Search size={15} className="match-search-icon" />
            <input
              className="match-search"
              placeholder="Rechercher une équipe…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="match-search-clear" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="game-filters">
            {GAME_FILTERS.map((f) => (
              <button
                key={f}
                className={`game-filter${gameFilter === f ? ' active' : ''}`}
                onClick={() => setGameFilter(f)}
              >
                {f}
              </button>
            ))}
            <button
              className={`game-filter chaud-filter${chaudOnly ? ' active' : ''}`}
              onClick={() => setChaudOnly(v => !v)}
            >
              <Flame size={12} /> Temps chaud
            </button>
          </div>

          <div className="status-filters">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.key}
                className={`status-filter status-filter--${s.key}${statusFilter === s.key ? ' active' : ''}`}
                onClick={() => setStatusFilter(s.key)}
              >
                {s.key === 'en_cours' && <span className="status-dot" />}
                {s.label}
              </button>
            ))}
          </div>

          {loading || loadingPronos ? (
            <div className="match-loading">Chargement des matchs…</div>
          ) : filtered.length === 0 ? (
            <p className="match-empty">Aucun match trouvé.</p>
          ) : (
            <div className="match-list">
              {showBoth ? (
                <>
                  {lolMatches.length > 0 && (
                    <>
                      <GameHeader game="lol" />
                      {renderCards(lolMatches)}
                    </>
                  )}
                  {valoMatches.length > 0 && (
                    <>
                      <GameHeader game="valo" />
                      {renderCards(valoMatches)}
                    </>
                  )}
                </>
              ) : (
                renderCards(filtered)
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 1 && <TournoiContent />}
      {activeTab === 2 && <ClassementContent />}
    </main>
  )
}
