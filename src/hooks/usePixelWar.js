import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { computeGrid, getCampScores, isTempsChaudEnCours } from '../lib/pixelWar'

const DEFAULT_SCORES = [
  { camp: 'lol',  total_points: 0, nb_participants_actifs: 0, score_moyen: 0, pixels_debloques: 0 },
  { camp: 'valo', total_points: 0, nb_participants_actifs: 0, score_moyen: 0, pixels_debloques: 0 },
]

export function usePixelWar() {
  const [campScores, setCampScores] = useState(DEFAULT_SCORES)
  const [chaud, setChaud] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const [scores, actif] = await Promise.all([getCampScores(), isTempsChaudEnCours()])
      if (scores?.length) setCampScores(scores)
      setChaud(actif)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('pw_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'camp_score' }, () => load())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'match' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const lol  = campScores.find(s => s.camp === 'lol')  ?? DEFAULT_SCORES[0]
  const valo = campScores.find(s => s.camp === 'valo') ?? DEFAULT_SCORES[1]

  const multiplicateur = chaud ? 2 : 1

  const grid = useMemo(
    () => computeGrid(lol.pixels_debloques * multiplicateur, valo.pixels_debloques * multiplicateur),
    [lol.pixels_debloques, valo.pixels_debloques, multiplicateur]
  )

  return { grid, lol, valo, loading, chaud }
}
