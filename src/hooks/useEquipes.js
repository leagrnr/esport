import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useEquipes() {
  const [equipes, setEquipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('equipe')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (!error && data) setEquipes(data)
        setLoading(false)
      })
  }, [])

  const byId = Object.fromEntries(equipes.map(e => [e.id, e]))

  return { equipes, byId, loading }
}
