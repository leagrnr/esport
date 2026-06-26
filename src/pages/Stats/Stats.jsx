import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import './Stats.css'

const GAME_TABS = [
  { key: 1, label: 'League of Legends', color: '#c8aa6e' },
  { key: 2, label: 'Valorant',          color: '#ff4655' },
]

function StatCard({ value, label, sub }) {
  return (
    <div className="stats-card">
      <span className="stats-card-value">{value}</span>
      <span className="stats-card-label">{label}</span>
      {sub && <span className="stats-card-sub">{sub}</span>}
    </div>
  )
}

export default function Stats() {
  const [matchStats, setMatchStats]   = useState(null)
  const [betStats, setBetStats]       = useState(null)
  const [campScores, setCampScores]   = useState([])
  const [persos, setPersos]           = useState([])
  const [gameTab, setGameTab]         = useState(1)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function load() {
      const [matchRes, campRes, persoRes, betRes] = await Promise.all([
        supabase.from('match').select('statut'),
        supabase.from('camp_score').select('camp,pixels_debloques,total_points'),
        supabase.from('performance')
          .select('personnage, match:match_id(jeu_id)')
          .not('personnage', 'is', null)
          .neq('personnage', ''),
        supabase.from('pronostic').select('est_correct'),
      ])

      if (matchRes.data) {
        setMatchStats({
          termine:  matchRes.data.filter(m => m.statut === 'termine').length,
          en_cours: matchRes.data.filter(m => m.statut === 'en_cours').length,
          a_venir:  matchRes.data.filter(m => m.statut === 'a_venir').length,
        })
      }

      if (betRes.data) {
        const total     = betRes.data.length
        const gagnes    = betRes.data.filter(p => p.est_correct === true).length
        const perdus    = betRes.data.filter(p => p.est_correct === false).length
        const en_attente = betRes.data.filter(p => p.est_correct === null).length
        setBetStats({ total, gagnes, perdus, en_attente })
      }

      if (campRes.data) setCampScores(campRes.data)

      if (persoRes.data) {
        const counts = {}
        for (const p of persoRes.data) {
          const jeu = p.match?.jeu_id
          if (!jeu) continue
          const key = `${jeu}__${p.personnage}`
          counts[key] = (counts[key] ?? 0) + 1
        }
        const list = Object.entries(counts).map(([key, nb]) => {
          const [jeu, nom] = key.split('__')
          return { jeu: Number(jeu), nom, nb }
        })
        setPersos(list)
      }

      setLoading(false)
    }
    load()
  }, [])

  const lol  = campScores.find(c => c.camp === 'lol')
  const valo = campScores.find(c => c.camp === 'valo')
  const totalPixels = (lol?.pixels_debloques ?? 0) + (valo?.pixels_debloques ?? 0)
  const lolPct  = totalPixels > 0 ? Math.round((lol?.pixels_debloques ?? 0) / totalPixels * 100) : 50
  const valoPct = 100 - lolPct

  const activeColor = GAME_TABS.find(g => g.key === gameTab)?.color ?? '#fff'
  const topPersos = persos
    .filter(p => p.jeu === gameTab)
    .sort((a, b) => b.nb - a.nb)
    .slice(0, 8)
  const maxNb = topPersos[0]?.nb ?? 1

  return (
    <main className="stats-page">
      <h1 className="stats-title">Statistiques</h1>

      {loading ? (
        <div className="stats-loading">Chargement…</div>
      ) : (
        <>
          {/* Pixel War */}
          <section className="stats-section">
            <h2 className="stats-section-title">Pixel War</h2>
            <div className="stats-pixel-block">
              <div className="stats-pixel-row">
                <div className="stats-pixel-camp stats-pixel-camp--lol">
                  <span className="stats-pixel-dot stats-pixel-dot--lol" />
                  <span className="stats-pixel-name">League of Legends</span>
                  <span className="stats-pixel-count">{lol?.pixels_debloques ?? 0} px</span>
                </div>
                <div className="stats-pixel-camp stats-pixel-camp--valo">
                  <span className="stats-pixel-count">{valo?.pixels_debloques ?? 0} px</span>
                  <span className="stats-pixel-name">Valorant</span>
                  <span className="stats-pixel-dot stats-pixel-dot--valo" />
                </div>
              </div>
              <div className="stats-pixel-bar">
                <div className="stats-pixel-bar-lol"  style={{ width: `${lolPct}%` }} />
                <div className="stats-pixel-bar-valo" style={{ width: `${valoPct}%` }} />
              </div>
              <div className="stats-pixel-pcts">
                <span style={{ color: '#c8aa6e' }}>{lolPct}%</span>
                <span style={{ color: '#ff4655' }}>{valoPct}%</span>
              </div>
              <div className="stats-pixel-pts-row">
                <span className="stats-pixel-pts">{(lol?.total_points ?? 0).toLocaleString()} pts accumulés</span>
                <span className="stats-pixel-pts">{(valo?.total_points ?? 0).toLocaleString()} pts accumulés</span>
              </div>
            </div>
          </section>

          {/* Matchs */}
          <section className="stats-section">
            <h2 className="stats-section-title">Matchs</h2>
            <div className="stats-cards-row">
              <StatCard value={matchStats?.termine  ?? 0} label="Joués"    />
              <StatCard value={matchStats?.en_cours ?? 0} label="En cours" />
              <StatCard value={matchStats?.a_venir  ?? 0} label="À venir"  />
            </div>
          </section>

          {/* Paris */}
          {betStats && (
            <section className="stats-section">
              <h2 className="stats-section-title">Paris placés — {betStats.total} total</h2>
              <div className="stats-bets-row">
                <div className="stats-bet-card stats-bet-card--win">
                  <span className="stats-bet-value">{betStats.gagnes}</span>
                  <span className="stats-bet-label">Gagnés</span>
                </div>
                <div className="stats-bet-card stats-bet-card--loss">
                  <span className="stats-bet-value">{betStats.perdus}</span>
                  <span className="stats-bet-label">Perdus</span>
                </div>
                <div className="stats-bet-card stats-bet-card--pending">
                  <span className="stats-bet-value">{betStats.en_attente}</span>
                  <span className="stats-bet-label">En attente</span>
                </div>
              </div>
              {betStats.total > 0 && (
                <div className="stats-bet-bar">
                  <div className="stats-bet-bar-win"   style={{ width: `${betStats.gagnes    / betStats.total * 100}%` }} />
                  <div className="stats-bet-bar-loss"  style={{ width: `${betStats.perdus    / betStats.total * 100}%` }} />
                  <div className="stats-bet-bar-pend"  style={{ width: `${betStats.en_attente / betStats.total * 100}%` }} />
                </div>
              )}
              <p className="stats-bet-winrate">
                Taux de réussite : <strong>{betStats.gagnes + betStats.perdus > 0
                  ? Math.round(betStats.gagnes / (betStats.gagnes + betStats.perdus) * 100)
                  : 0}%</strong>
              </p>
            </section>
          )}

          {/* Top personnages */}
          <section className="stats-section">
            <h2 className="stats-section-title">Top personnages</h2>
            <div className="stats-game-tabs">
              {GAME_TABS.map(g => (
                <button
                  key={g.key}
                  className={`stats-game-tab${gameTab === g.key ? ' active' : ''}`}
                  style={gameTab === g.key ? { color: g.color, borderColor: g.color, background: `${g.color}18` } : {}}
                  onClick={() => setGameTab(g.key)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            {topPersos.length === 0 ? (
              <p className="stats-empty">Aucune donnée disponible.</p>
            ) : (
              <div className="stats-perso-list">
                {topPersos.map((p, i) => (
                  <div key={p.nom} className="stats-perso-row">
                    <span className="stats-perso-rank" style={i < 3 ? { color: activeColor } : {}}>
                      #{i + 1}
                    </span>
                    <span className="stats-perso-name">{p.nom}</span>
                    <div className="stats-perso-bar-wrap">
                      <div
                        className="stats-perso-bar"
                        style={{ width: `${Math.round(p.nb / maxNb * 100)}%`, background: activeColor }}
                      />
                    </div>
                    <span className="stats-perso-nb">{p.nb}×</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}
