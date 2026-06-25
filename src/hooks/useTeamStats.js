import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useTeamStats() {
  const [teams,   setTeams]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('equipe').select('*').not('jeu_id', 'is', null).order('nom'),
      supabase.from('match').select('equipe1_id,equipe2_id,score').eq('statut', 'termine'),
    ]).then(([{ data: equipes }, { data: done }]) => {
      if (!equipes) return setLoading(false)

      const stats = {}
      equipes.forEach(e => { stats[e.id] = { wins: 0, losses: 0 } })

      ;(done ?? []).forEach(m => {
        if (!m.score) return
        const [s1, s2] = m.score.split('-').map(Number)
        if (isNaN(s1) || isNaN(s2)) return
        const e1wins = s1 > s2
        if (stats[m.equipe1_id]) e1wins ? stats[m.equipe1_id].wins++   : stats[m.equipe1_id].losses++
        if (stats[m.equipe2_id]) e1wins ? stats[m.equipe2_id].losses++ : stats[m.equipe2_id].wins++
      })

      setTeams(equipes.map(e => ({
        ...e,
        wins:   stats[e.id]?.wins   ?? 0,
        losses: stats[e.id]?.losses ?? 0,
      })))
      setLoading(false)
    })
  }, [])

  return { teams, loading }
}
