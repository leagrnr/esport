import { useState } from 'react'
import { FlaskConical, RotateCcw } from 'lucide-react'
import { usePixelWar } from '../../hooks/usePixelWar'
import { useAuth } from '../../contexts/AuthContext'
import { GRID_COLS, GRID_ROWS, GRID_TOTAL, getLolTotal, getValoTotal, resetPixelWar } from '../../lib/pixelWar'
import { runSeedDemo } from '../../lib/seedDemo'
import './PixelWar.css'

const LOL_COLOR  = '#c8aa6e'
const VALO_COLOR = '#ff4655'

function CampCard({ score, color, name, total }) {
  const pct = total > 0 ? ((score.pixels_debloques / total) * 100).toFixed(1) : '0.0'
  return (
    <div className="pw-camp-card" style={{ '--camp-color': color }}>
      <div className="pw-camp-dot" />
      <div className="pw-camp-info">
        <span className="pw-camp-name">{name}</span>
        <span className="pw-camp-moyen">
          {Number(score.score_moyen).toFixed(1)} pts moy.
        </span>
        <span className="pw-camp-actifs">
          {score.nb_participants_actifs} participant{score.nb_participants_actifs !== 1 ? 's' : ''} actif{score.nb_participants_actifs !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="pw-camp-pixels">
        <span className="pw-camp-pct">{pct}%</span>
        <span className="pw-camp-px">{score.pixels_debloques} px</span>
      </div>
    </div>
  )
}

export default function PixelWar() {
  const { grid, lol, valo, loading } = usePixelWar()
  const { profile } = useAuth()
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const [resetting, setResetting] = useState(false)
  const [resetMsg, setResetMsg] = useState('')

  async function handleSeed() {
    if (!window.confirm('Insérer les données de démo ? (15 spectateurs fictifs + 3 matchs résolus)')) return
    setSeedMsg('')
    setSeeding(true)
    try {
      await runSeedDemo()
      setSeedMsg('Démo chargée !')
    } catch (e) {
      setSeedMsg(`Erreur : ${e.message}`)
    } finally {
      setSeeding(false)
    }
  }

  async function handleReset() {
    if (!window.confirm('Remettre le Pixel War à zéro ? Tous les scores des camps seront effacés.')) return
    setResetMsg('')
    setResetting(true)
    try {
      await resetPixelWar()
      setResetMsg('Pixel War réinitialisé.')
    } catch (e) {
      setResetMsg(`Erreur : ${e.message}`)
    } finally {
      setResetting(false)
    }
  }

  const lolTotal  = getLolTotal()
  const valoTotal = getValoTotal()
  const lolPct  = lolTotal  > 0 ? ((lol.pixels_debloques  / lolTotal)  * 100).toFixed(1) : '0.0'
  const valoPct = valoTotal > 0 ? ((valo.pixels_debloques / valoTotal) * 100).toFixed(1) : '0.0'

  return (
    <main className="pw-page">
      <div className="pw-header">
        <h1 className="pw-title">Pixel War</h1>
        <p className="pw-subtitle">
          Chaque pronostic correct débloque des pixels pour ton camp.
          Le score est calculé en <strong>moyenne par participant</strong> — pour rester équitable même si les camps ne sont pas égaux.
        </p>
      </div>

      <div className="pw-camp-cards">
        <CampCard score={lol}  color={LOL_COLOR}  name="League of Legends" total={lolTotal} />
        <CampCard score={valo} color={VALO_COLOR} name="Valorant"           total={valoTotal} />
      </div>

      <div className="pw-grid-wrap">
        {loading ? (
          <div className="pw-loading">Chargement…</div>
        ) : (
          <>
            <div
              className="pw-grid"
              style={{ '--cols': GRID_COLS, '--rows': GRID_ROWS }}
            >
              {grid.map((camp, i) => (
                <div
                  key={i}
                  className={`pw-cell${camp ? ` pw-cell--${camp}` : ''}`}
                />
              ))}
            </div>

            <div className="pw-legend">
              <div className="pw-legend-bar">
                <div className="pw-legend-fill pw-legend-fill--lol" style={{ width: `${lolPct}%` }} />
                <div className="pw-legend-fill pw-legend-fill--valo" style={{ width: `${valoPct}%` }} />
              </div>
              <div className="pw-legend-labels">
                <span style={{ color: LOL_COLOR }}>LoL {lolPct}%</span>
                <span className="pw-legend-total">{GRID_TOTAL} pixels</span>
                <span style={{ color: VALO_COLOR }}>{valoPct}% Valo</span>
              </div>
            </div>

            <div className="pw-equity-note">
              <span className="pw-equity-icon">⚖</span>
              <span>
                Progression basée sur le score moyen — pas le nombre d'inscrits.
                Un camp de {Math.round(GRID_TOTAL * 0.5)} membres actifs progresse autant qu'un camp de {GRID_TOTAL} membres si leur engagement est identique.
              </span>
            </div>
          </>
        )}
      </div>

      <div className="pw-grid-info">
        <span>Cristal : {lolTotal} px · Radar : {valoTotal} px · seuil 5 pts moy. = 1 px</span>
      </div>

      {profile?.role === 'admin' && (
        <div className="pw-demo-bar">
          <button className="pw-demo-btn" disabled={seeding} onClick={handleSeed}>
            <FlaskConical size={15} />
            {seeding ? 'Chargement…' : 'Charger la démo'}
          </button>
          {seedMsg && <p className="pw-demo-msg">{seedMsg}</p>}
          <button className="pw-demo-btn pw-reset-btn" disabled={resetting} onClick={handleReset}>
            <RotateCcw size={15} />
            {resetting ? 'Réinitialisation…' : 'Reset Pixel War'}
          </button>
          {resetMsg && <p className="pw-demo-msg pw-reset-msg">{resetMsg}</p>}
        </div>
      )}
    </main>
  )
}
