import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { computeGrid, getCampScores } from '../lib/pixelWar'

const DEFAULT_SCORES = [
  { camp: 'lol',  total_points: 0, nb_participants_actifs: 0, score_moyen: 0, pixels_debloques: 0 },
  { camp: 'valo', total_points: 0, nb_participants_actifs: 0, score_moyen: 0, pixels_debloques: 0 },
]

export function usePixelWar() {
  const [campScores, setCampScores] = useState(DEFAULT_SCORES)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const data = await getCampScores()
      if (data?.length) setCampScores(data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('camp_score_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'camp_score' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const lol  = campScores.find(s => s.camp === 'lol')  ?? DEFAULT_SCORES[0]
  const valo = campScores.find(s => s.camp === 'valo') ?? DEFAULT_SCORES[1]

  // Recalcule la grille uniquement quand les compteurs changent
  const grid = useMemo(
    () => computeGrid(lol.pixels_debloques, valo.pixels_debloques),
    [lol.pixels_debloques, valo.pixels_debloques]
  )

  return { grid, lol, valo, loading }
}
