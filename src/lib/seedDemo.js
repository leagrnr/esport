import { supabase } from './supabase'
import { getLolTotal, getValoTotal } from './pixelWar'

export async function runSeedDemo() {
  // 1. Insère les données (utilisateurs, matchs, pronostics, résolution)
  const { data, error } = await supabase.rpc('run_seed_demo')
  if (error) throw new Error(error.message)
  if (data !== 'ok') throw new Error(data)

  // 2. Force les deux icônes à 100% révélées
  const { error: e2 } = await supabase.rpc('set_demo_pixels', {
    p_lol_px:  getLolTotal(),
    p_valo_px: getValoTotal(),
  })
  if (e2) throw new Error(e2.message)
}
