import { useState, useEffect } from 'react'
import { Flame, RotateCcw, FlaskConical } from 'lucide-react'
import { getTempsChaudMatches, resetPixelWar } from '../../../lib/pixelWar'
import { runSeedDemo } from '../../../lib/seedDemo'

const STATUT_LABEL = { a_venir: 'À venir', en_cours: 'En cours', termine: 'Terminé' }
const STATUT_CLASS  = { a_venir: '', en_cours: 'apw-match-live', termine: 'apw-match-done' }

export default function AdminPixelWar() {
  const [tcMatches, setTcMatches] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [resetMsg, setResetMsg] = useState('')
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  useEffect(() => {
    getTempsChaudMatches()
      .then(data => setTcMatches(data))
      .catch(() => {})
      .finally(() => setLoadingList(false))
  }, [])

  async function handleReset() {
    if (!window.confirm('Remettre le Pixel War à zéro ?')) return
    setResetting(true)
    setResetMsg('')
    try {
      await resetPixelWar()
      setResetMsg('Pixel War réinitialisé.')
    } catch (e) {
      setResetMsg(`Erreur : ${e.message}`)
    } finally {
      setResetting(false)
    }
  }

  async function handleSeed() {
    if (!window.confirm('Insérer les données de démo ?')) return
    setSeeding(true)
    setSeedMsg('')
    try {
      await runSeedDemo()
      setSeedMsg('Démo chargée !')
    } catch (e) {
      setSeedMsg(`Erreur : ${e.message}`)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="admin-section">

      {/* Liste des matchs temps chaud */}
      <div className="apw-block">
        <div className="apw-block-header">
          <Flame size={15} className="apw-flame" />
          <span>Matchs en temps chaud</span>
        </div>
        <p className="apw-desc">
          Active la flamme <Flame size={11} style={{ display: 'inline', verticalAlign: 'middle', color: '#ff6b2b' }} /> sur un match dans l'onglet <strong>Matchs</strong> pour le marquer.
          Les pixels sont ×2 dès qu'un match marqué passe <strong>En cours</strong>.
        </p>

        {loadingList ? (
          <p className="apw-desc">Chargement…</p>
        ) : tcMatches.length === 0 ? (
          <p className="apw-desc" style={{ fontStyle: 'italic' }}>Aucun match en temps chaud configuré.</p>
        ) : (
          <div className="apw-match-list">
            {tcMatches.map(m => (
              <div key={m.id} className={`apw-match-row ${STATUT_CLASS[m.statut] ?? ''}`}>
                <span className="apw-match-name">
                  {m.equipe1?.nom ?? '?'} vs {m.equipe2?.nom ?? '?'}
                </span>
                <span className="apw-match-statut">{STATUT_LABEL[m.statut] ?? m.statut}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outils */}
      <div className="apw-block">
        <div className="apw-block-header">
          <span>Outils</span>
        </div>
        <div className="apw-tools">
          <button className="apw-tool-btn" disabled={seeding} onClick={handleSeed}>
            <FlaskConical size={14} />
            {seeding ? 'Chargement…' : 'Charger la démo'}
          </button>
          {seedMsg && <p className="apw-msg">{seedMsg}</p>}
          <button className="apw-tool-btn apw-tool-btn--danger" disabled={resetting} onClick={handleReset}>
            <RotateCcw size={14} />
            {resetting ? 'Réinitialisation…' : 'Reset Pixel War'}
          </button>
          {resetMsg && <p className="apw-msg apw-msg--danger">{resetMsg}</p>}
        </div>
      </div>

    </div>
  )
}
