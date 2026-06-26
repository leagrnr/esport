import { supabase } from './supabase'
import { GRID_COLS, GRID_ROWS, getLolPattern, getValoPattern } from './pixelArt'

export { GRID_COLS, GRID_ROWS }
export const GRID_TOTAL = GRID_COLS * GRID_ROWS

export function computeGrid(lolPixels, valoPixels) {
  const lolPts  = getLolPattern()
  const valoPts = getValoPattern()
  const map     = {}

  for (let i = 0; i < Math.min(lolPixels, lolPts.length); i++) {
    const [r, c] = lolPts[i]
    map[r * GRID_COLS + c] = 'lol'
  }
  for (let i = 0; i < Math.min(valoPixels, valoPts.length); i++) {
    const [r, c] = valoPts[i]
    map[r * GRID_COLS + c] = 'valo'
  }

  return Array.from({ length: GRID_TOTAL }, (_, i) => map[i] ?? null)
}

export function getLolTotal()  { return getLolPattern().length }
export function getValoTotal() { return getValoPattern().length }

export async function soumettrePronositc(utilisateurId, matchId, equipeGagnanteId) {
  const { error } = await supabase.from('pronostic').insert({
    utilisateur_id:     utilisateurId,
    match_id:           matchId,
    equipe_gagnante_id: equipeGagnanteId,
  })
  if (error) throw error
}

export async function resoudreMatch(matchId, gagnantId) {
  const { data, error } = await supabase.rpc('resoudre_match', {
    p_match_id:   matchId,
    p_gagnant_id: gagnantId,
  })
  if (error) throw error
  return data
}

export async function getCampScores() {
  const { data, error } = await supabase.from('camp_score').select('*')
  if (error) throw error
  return data
}

export async function getUserPronostics(utilisateurId) {
  const { data, error } = await supabase
    .from('pronostic')
    .select('match_id, equipe_gagnante_id, est_correct, points_gagnes')
    .eq('utilisateur_id', utilisateurId)
  if (error) return []
  return data
}

export async function resetPixelWar() {
  const { error } = await supabase
    .from('camp_score')
    .update({ total_points: 0, nb_participants_actifs: 0, score_moyen: 0, pixels_debloques: 0 })
    .in('camp', ['lol', 'valo'])
  if (error) throw error
}
