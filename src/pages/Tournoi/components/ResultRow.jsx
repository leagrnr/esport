import './ResultRow.css'

export default function ResultRow({ match }) {
  const { team1, score1, score2, team2 } = match

  return (
    <div className="result-row">
      <div className="result-team result-team--left">
        <span className="result-name">{team1}</span>
        <span className="result-score result-score--win">{score1}</span>
      </div>
      <div className="result-team result-team--right">
        <span className="result-score result-score--lose">{score2}</span>
        <span className="result-name">{team2}</span>
      </div>
    </div>
  )
}
