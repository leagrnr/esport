import { Flame } from 'lucide-react'
import { usePixelWar } from '../../hooks/usePixelWar'
import { GRID_COLS, GRID_ROWS, GRID_TOTAL, getLolTotal, getValoTotal } from '../../lib/pixelWar'
import './PixelWar.css'

const LOL_COLOR  = '#c8aa6e'
const VALO_COLOR = '#ff4655'

function CampCard({ score, color, name, total, chaud }) {
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
        <span className="pw-camp-px">{score.pixels_debloques} px{chaud ? ' ×2' : ''}</span>
      </div>
    </div>
  )
}

export default function PixelWar() {
  const { grid, lol, valo, loading, chaud } = usePixelWar()

  const lolTotal  = getLolTotal()
  const valoTotal = getValoTotal()
  const lolPct  = lolTotal  > 0 ? ((lol.pixels_debloques  / lolTotal)  * 100).toFixed(1) : '0.0'
  const valoPct = valoTotal > 0 ? ((valo.pixels_debloques / valoTotal) * 100).toFixed(1) : '0.0'

  return (
    <main className="pw-page">
      <div className="pw-header">
        <h1 className="pw-title">
          Pixel War
          {chaud && <span className="pw-chaud-badge"><Flame size={14} /> ×2</span>}
        </h1>
        <p className="pw-subtitle">
          Chaque pronostic correct débloque des pixels pour ton camp.
          Le score est calculé en <strong>moyenne par participant</strong> — pour rester équitable même si les camps ne sont pas égaux.
        </p>
        {chaud && (
          <p className="pw-chaud-notice">
            <Flame size={12} /> Temps chaud actif — chaque pixel compte double !
          </p>
        )}
      </div>

      <div className="pw-camp-cards">
        <CampCard score={lol}  color={LOL_COLOR}  name="League of Legends" total={lolTotal} chaud={chaud} />
        <CampCard score={valo} color={VALO_COLOR} name="Valorant"           total={valoTotal} chaud={chaud} />
      </div>

      <div className="pw-grid-wrap">
        {loading ? (
          <div className="pw-loading">Chargement…</div>
        ) : (
          <>
            <div
              className={`pw-grid${chaud ? ' pw-grid--chaud' : ''}`}
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
    </main>
  )
}
