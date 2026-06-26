// Pixel art shapes — generic, no official game assets
// LoL  → cristal générique (gemme facettée, fantasy/magie)
// Valo → radar tactique générique (cercle + réticule, FPS/tactique)

export const GRID_COLS = 48
export const GRID_ROWS = 32

function addPt(set, r, c) {
  if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) set.add(`${r},${c}`)
}

// Interpolation linéaire — correcte, bornée, impossible à boucler infiniment
function line(set, r0, c0, r1, c1) {
  const steps = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0))
  if (steps === 0) { addPt(set, r0, c0); return }
  for (let i = 0; i <= steps; i++) {
    addPt(set, Math.round(r0 + (r1 - r0) * i / steps),
               Math.round(c0 + (c1 - c0) * i / steps))
  }
}

function circle(set, cy, cx, radius, thicken = false) {
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      const dist = Math.sqrt(dr * dr + dc * dc)
      if (Math.abs(dist - radius) < 0.85) {
        addPt(set, cy + dr, cx + dc)
        if (thicken) {
          addPt(set, cy + dr + 1, cx + dc)
          addPt(set, cy + dr, cx + dc + 1)
        }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────
// LoL — Cristal générique (gemme facettée, inspiration fantasy)
// Centré en (col=12, row=15) dans la moitié gauche
// ─────────────────────────────────────────────────────────────
// Cache module-level (recalculé une seule fois au chargement)
let _lolCache = null
export function getLolPattern() {
  if (_lolCache) return _lolCache
  const outline = new Set()   // révélé en premier
  const facets  = new Set()   // révélé ensuite
  const details = new Set()   // révélé en dernier

  const cx = 12, cy = 15

  // ── 1. CONTOUR EXTÉRIEUR (losange allongé = silhouette de gemme) ──
  // Sommet haut
  const TOP   = [cy - 12, cx]
  // Flancs gauche/droite (point le + large au niveau du cy)
  const LEFT  = [cy,      cx - 9]
  const RIGHT = [cy,      cx + 9]
  // Pointe bas
  const BOT   = [cy + 13, cx]

  line(outline, ...TOP, ...LEFT)
  line(outline, ...TOP, ...RIGHT)
  line(outline, ...LEFT, ...BOT)
  line(outline, ...RIGHT, ...BOT)

  // ── 2. FACETTE HORIZONTALE DU DESSUS (table de la gemme) ──
  // Ligne horizontale à cy-5, de la largeur intérieure correspondante
  const tableRow = cy - 5
  // À row tableRow, le bord gauche est approx cx - 9*(tableRow-cy)/(-12) ...
  // Plus simple : on calcule depuis le contour
  const tableL = cx - 6, tableR = cx + 6
  line(facets, tableRow, tableL, tableRow, tableR)

  // Lignes diagonales reliant les coins de la table au contour supérieur
  line(facets, tableRow, tableL, cy - 12, cx)
  line(facets, tableRow, tableR, cy - 12, cx)

  // Lignes diagonales reliant les coins de la table au contour latéral
  line(facets, tableRow, tableL, cy, cx - 9)
  line(facets, tableRow, tableR, cy, cx + 9)

  // ── 3. FACETTE BASSE (pavillon de la gemme) ──
  // Ligne horizontale à cy+3 (entre le cy et la pointe basse)
  const pavRow = cy + 3
  const pavL = cx - 5, pavR = cx + 5
  line(facets, pavRow, pavL, pavRow, pavR)
  // Diagonales vers la pointe basse
  line(facets, pavRow, pavL, cy + 13, cx)
  line(facets, pavRow, pavR, cy + 13, cx)
  // Diagonales vers les points larges
  line(facets, pavRow, pavL, cy, cx - 9)
  line(facets, pavRow, pavR, cy, cx + 9)

  // ── 4. ÉCLAT CENTRAL (highlight, petite croix lumineuse) ──
  // Petit losange autour du centre optique de la table
  const hcy = tableRow - 2, hcx = cx
  addPt(details, hcy - 1, hcx)
  addPt(details, hcy,     hcx - 1)
  addPt(details, hcy,     hcx)
  addPt(details, hcy,     hcx + 1)
  addPt(details, hcy + 1, hcx)

  // ── Merge dans l'ordre de révélation ──
  // outline d'abord → facets → details
  const ordered = []
  for (const s of outline) ordered.push(s.split(',').map(Number))
  for (const s of facets)  if (!outline.has(s))  ordered.push(s.split(',').map(Number))
  for (const s of details) if (!outline.has(s) && !facets.has(s)) ordered.push(s.split(',').map(Number))

  _lolCache = ordered
  return _lolCache
}

// ─────────────────────────────────────────────────────────────
// Valo — Radar tactique générique (cercle + réticule + balayage)
// Centré en (col=36, row=15) dans la moitié droite
// ─────────────────────────────────────────────────────────────
let _valoCache = null
export function getValoPattern() {
  if (_valoCache) return _valoCache

  const outline = new Set()   // cercle + réticule
  const sweep   = new Set()   // arc de balayage
  const details = new Set()   // cercle interne + centre

  const cx = 36, cy = 15

  // ── 1. CERCLE EXTÉRIEUR (radius 9) ──
  circle(outline, cy, cx, 9)

  // ── 2. RÉTICULE (croix) — avec espacement au centre ──
  const gap = 3
  // Horizontal
  for (let dc = -9; dc <= 9; dc++) {
    if (Math.abs(dc) >= gap) addPt(outline, cy, cx + dc)
  }
  // Vertical
  for (let dr = -9; dr <= 9; dr++) {
    if (Math.abs(dr) >= gap) addPt(outline, cy + dr, cx)
  }

  // ── 3. ARC DE BALAYAGE (secteur 0°→75°, radius 6) ──
  for (let angle = 0; angle <= 75; angle++) {
    const rad = (angle - 90) * Math.PI / 180  // 0° = haut
    const r = Math.round(cy + 6 * Math.sin(rad))
    const c = Math.round(cx + 6 * Math.cos(rad))
    addPt(sweep, r, c)
  }
  // Lignes de bord du secteur
  line(sweep, cy, cx, cy - 6, cx)                            // rayon 0° (haut)
  line(sweep, cy, cx,
    Math.round(cy + 6 * Math.sin((75 - 90) * Math.PI / 180)),
    Math.round(cx + 6 * Math.cos((75 - 90) * Math.PI / 180)) // rayon 75°
  )

  // ── 4. CERCLE INTERNE (radius 4) ──
  circle(details, cy, cx, 4)

  // ── 5. POINT CENTRAL (3×3) ──
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++)
      addPt(details, cy + dr, cx + dc)

  // ── Merge dans l'ordre de révélation ──
  const all = new Set()
  const ordered = []

  function flush(s) {
    for (const k of s) {
      if (!all.has(k)) { all.add(k); ordered.push(k.split(',').map(Number)) }
    }
  }

  flush(outline)
  flush(sweep)
  flush(details)

  _valoCache = ordered
  return _valoCache
}
