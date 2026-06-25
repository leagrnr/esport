import { Check, Lock, AlertCircle } from 'lucide-react'
import './MatchCard.css'

function getPoints(vote1, vote2, team) {
  return team === 'team1' ? vote2 : vote1
}

function StatusBadge({ statut, score, selected, activePts }) {
  if (statut === 'en_cours')
    return <span className="match-badge match-badge--live">LIVE</span>
  if (statut === 'termine')
    return <span className="match-badge match-badge--termine">{score ?? 'Terminé'}</span>
  if (selected)
    return <span className="match-badge match-badge--done"><Check size={10} /> +{activePts} pts</span>
  return null
}

export default function MatchCard({ match, selected, pending, onVote, onConfirm, onCancel }) {
  const { label, team1, team2, vote1, locked, logo1, logo2, statut, score } = match
  const vote2    = 100 - vote1
  const choosing = pending && !selected

  const pts1 = getPoints(vote1, vote2, 'team1')
  const pts2 = getPoints(vote1, vote2, 'team2')

  const activePts = pending === 'team1' || selected === 'team1' ? pts1
                  : pending === 'team2' || selected === 'team2' ? pts2
                  : null

  return (
    <div className={`match-card match-card--${statut}${selected ? ' match-card--voted' : ''}`}>

      <div className="match-header">
        <span className="match-game-tag">{label}</span>
        <StatusBadge statut={statut} score={score} selected={selected} activePts={activePts} />
      </div>

      <div className="match-teams">
        <button
          className={`team-btn
            ${pending === 'team1' || selected === 'team1' ? ' selected' : ''}
            ${(pending && pending !== 'team1') || (selected && selected !== 'team1') ? ' dimmed' : ''}
          `}
          onClick={() => !locked && !selected && onVote('team1')}
          disabled={locked || !!selected}
        >
          {logo1
            ? <img className="team-avatar" src={logo1} alt={team1} />
            : <span className="team-avatar" />
          }
          <span className="team-name">{team1}</span>
          <div className="team-footer">
            <span className="team-pct">{vote1}%</span>
            <span className="team-pts">+{pts1} pts</span>
          </div>
          {(pending === 'team1' || selected === 'team1') && <span className="team-check"><Check size={14} /></span>}
        </button>

        <div className="match-vs">
          {statut === 'en_cours' ? <span className="vs-live-dot" /> : locked ? <Lock size={14} className="vs-lock" /> : 'VS'}
        </div>

        <button
          className={`team-btn
            ${pending === 'team2' || selected === 'team2' ? ' selected' : ''}
            ${(pending && pending !== 'team2') || (selected && selected !== 'team2') ? ' dimmed' : ''}
          `}
          onClick={() => !locked && !selected && onVote('team2')}
          disabled={locked || !!selected}
        >
          {logo2
            ? <img className="team-avatar" src={logo2} alt={team2} />
            : <span className="team-avatar" />
          }
          <span className="team-name">{team2}</span>
          <div className="team-footer">
            <span className="team-pct">{vote2}%</span>
            <span className="team-pts">+{pts2} pts</span>
          </div>
          {(pending === 'team2' || selected === 'team2') && <span className="team-check"><Check size={14} /></span>}
        </button>
      </div>

      {choosing && (
        <div className="match-confirm">
          <span className="match-confirm-text">
            <AlertCircle size={13} />
            Parier sur <strong>{pending === 'team1' ? team1 : team2}</strong> pour <strong>+{activePts} pts</strong> ?
          </span>
          <div className="match-confirm-actions">
            <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>Annuler</button>
            <button className="confirm-btn confirm-btn--ok" onClick={onConfirm}>Confirmer</button>
          </div>
        </div>
      )}

      <div className="match-bar-wrap">
        <div className="match-bar">
          <div className="match-bar-fill" style={{ width: `${vote1}%` }} />
        </div>
        <span className="match-community">Paris de la communauté</span>
      </div>
    </div>
  )
}
