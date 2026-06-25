import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const JEU = {
  1: { game: 'lol',  label: 'League of Legends' },
  2: { game: 'valo', label: 'Valorant' },
}

function toCard(m) {
  const jeu = JEU[m.jeu_id] ?? { game: 'lol', label: '' }
  return {
    id:     m.id,
    game:   jeu.game,
    label:  jeu.label,
    team1:  m.equipe1?.nom      ?? '?',
    team2:  m.equipe2?.nom      ?? '?',
    logo1:  m.equipe1?.logo_url,
    logo2:  m.equipe2?.logo_url,
    vote1:  30 + (m.id * 13) % 41,   // placeholder jusqu'à ce que la table vote soit remplie
    locked: m.statut !== 'a_venir',
    statut: m.statut,
    score:  m.score,
  }
}

const STATUT_ORDER = { en_cours: 0, a_venir: 1, termine: 2 }

export function useMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('match')
      .select('id,statut,score,jeu_id,date_heure,equipe1:equipe1_id(id,nom,logo_url),equipe2:equipe2_id(id,nom,logo_url)')
      .order('statut', { ascending: true })
      .order('date_heure', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          const sorted = [...data].sort(
            (a, b) => (STATUT_ORDER[a.statut] ?? 3) - (STATUT_ORDER[b.statut] ?? 3)
          )
          setMatches(sorted.map(toCard))
        }
        setLoading(false)
      })
  }, [])

  return { matches, loading }
}
