import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useMatchPerformances(matchId, enabled) {
  const [performances, setPerformances] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled || !matchId) return
    setLoading(true)
    supabase
      .from('performance')
      .select('id, personnage, kills, morts, assistances, equipe_id, joueur:joueur_id(nom)')
      .eq('match_id', matchId)
      .then(({ data, error }) => {
        if (!error && data) setPerformances(data)
        setLoading(false)
      })
  }, [matchId, enabled])

  return { performances, loading }
}
