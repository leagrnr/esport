import { useEffect, useState } from 'react'
import { getUserPronostics } from '../lib/pixelWar'

export function usePronostics(utilisateurId, refreshKey = 0) {
  const [pronostics, setPronostics] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!utilisateurId) { setPronostics([]); return }
    setLoading(true)
    getUserPronostics(utilisateurId).then(data => {
      setPronostics(data)
      setLoading(false)
    })
  }, [utilisateurId, refreshKey])

  // Map matchId → { equipe_gagnante_id, est_correct, points_gagnes }
  const byMatch = Object.fromEntries(pronostics.map(p => [p.match_id, p]))

  return { byMatch, loading }
}
