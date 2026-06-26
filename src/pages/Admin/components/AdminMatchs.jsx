import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, CheckCircle, Flame } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { resoudreMatch, toggleTempsChaudMatch } from '../../../lib/pixelWar'
import AdminFormModal, { Field } from './AdminFormModal'

const JEUX = [
  { id: 1, label: 'League of Legends' },
  { id: 2, label: 'Valorant' },
]
const STATUTS = [
  { value: 'a_venir', label: 'À venir' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
]

const EMPTY = { jeu_id: '1', equipe1_id: '', equipe2_id: '', date_heure: '', phase: '', statut: 'a_venir', score: '', gagnant_id: '' }

export default function AdminMatchs() {
  const [matches, setMatches] = useState([])
  const [equipes, setEquipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resolvingId, setResolvingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const [mRes, eRes] = await Promise.all([
      supabase.from('match')
        .select('*, equipe1:equipe1_id(id,nom), equipe2:equipe2_id(id,nom)')
        .order('date_heure', { ascending: true }),
      supabase.from('equipe').select('id,nom').order('nom'),
    ])
    setMatches(mRes.data || [])
    setEquipes(eRes.data || [])
    setLoading(false)
  }

  function openCreate() {
    setForm(EMPTY)
    setEditId(null)
    setError('')
    setOpen(true)
  }

  function openEdit(m) {
    setForm({
      jeu_id:      String(m.jeu_id || 1),
      equipe1_id:  String(m.equipe1_id || m.equipe1?.id || ''),
      equipe2_id:  String(m.equipe2_id || m.equipe2?.id || ''),
      date_heure:  m.date_heure ? m.date_heure.slice(0, 16) : '',
      phase:       m.phase || '',
      statut:      m.statut || 'a_venir',
      score:       m.score || '',
      gagnant_id:  String(m.gagnant_id || ''),
    })
    setEditId(m.id)
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.equipe1_id || !form.equipe2_id) { setError('Sélectionne les deux équipes'); return }
    if (form.equipe1_id === form.equipe2_id) { setError('Les deux équipes doivent être différentes'); return }
    if (form.statut === 'termine' && !form.score) { setError('Renseigne le score final (ex : 2-1)'); return }
    setSaving(true)
    const payload = {
      jeu_id:     Number(form.jeu_id),
      equipe1_id: Number(form.equipe1_id),
      equipe2_id: Number(form.equipe2_id),
      date_heure: form.date_heure || null,
      phase:      form.phase || null,
      statut:     form.statut,
      score:      form.score || null,
      gagnant_id: form.gagnant_id ? Number(form.gagnant_id) : null,
    }
    const { error: err } = editId
      ? await supabase.from('match').update(payload).eq('id', editId)
      : await supabase.from('match').insert(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    setOpen(false)
    load()
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce match ?')) return
    await supabase.from('match').delete().eq('id', id)
    load()
  }

  async function handleResoudre(m) {
    if (!m.gagnant_id) {
      alert("Définis d'abord l'équipe gagnante dans le formulaire d'édition.")
      return
    }
    if (!window.confirm(`Résoudre les pronostics de ce match ? (gagnant : ${m.gagnant_id === m.equipe1?.id ? m.equipe1.nom : m.equipe2?.nom})`)) return
    setResolvingId(m.id)
    try {
      const result = await resoudreMatch(m.id, m.gagnant_id)
      if (result?.error) {
        if (result.error === 'already_resolved') alert('Les pronostics de ce match ont déjà été résolus.')
        else alert(`Erreur : ${result.error}`)
      }
      load()
    } catch (e) {
      alert(`Erreur : ${e.message}`)
    } finally {
      setResolvingId(null)
    }
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  const statutLabel = v => STATUTS.find(s => s.value === v)?.label || v

  const equipesDuMatch = (m) => [
    { id: m.equipe1?.id, nom: m.equipe1?.nom },
    { id: m.equipe2?.id, nom: m.equipe2?.nom },
  ].filter(e => e.id)

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <span className="admin-count">{matches.length} match(s)</span>
        <button className="admin-add-btn" onClick={openCreate}>
          <Plus size={16} /> Nouveau
        </button>
      </div>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : matches.length === 0 ? (
        <p className="admin-empty">Aucun match.</p>
      ) : (
        <div className="admin-list">
          {matches.map(m => (
            <div key={m.id} className="admin-row">
              <div className="admin-row-main">
                <span className={`admin-game-dot admin-game-dot--${m.jeu_id === 1 ? 'lol' : 'valo'}`} />
                <div className="admin-row-info">
                  <span className="admin-row-title">
                    {m.equipe1?.nom ?? '?'} vs {m.equipe2?.nom ?? '?'}
                  </span>
                  <span className="admin-row-sub">
                    {m.date_heure ? new Date(m.date_heure).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                    {m.score ? ` · ${m.score}` : ''}
                    {m.phase ? ` · ${m.phase}` : ''}
                    {m.statut === 'termine' && !m.score && <span className="admin-row-warn"> · Score manquant</span>}
                  </span>
                </div>
              </div>
              <div className="admin-row-actions">
                <span className={`admin-status-badge admin-status-badge--${m.statut}`}>{statutLabel(m.statut)}</span>
                {m.statut === 'termine' && m.gagnant_id && (
                  <button
                    className="admin-icon-btn admin-icon-btn--resolve"
                    title="Résoudre les pronostics"
                    disabled={resolvingId === m.id}
                    onClick={() => handleResoudre(m)}
                  >
                    <CheckCircle size={15} />
                  </button>
                )}
                <button
                  className={`admin-icon-btn${m.temps_chaud ? ' admin-icon-btn--chaud' : ''}`}
                  title={m.temps_chaud ? 'Désactiver le temps chaud' : 'Activer le temps chaud'}
                  onClick={async () => { await toggleTempsChaudMatch(m.id, m.temps_chaud); load() }}
                >
                  <Flame size={15} />
                </button>
                <button className="admin-icon-btn" onClick={() => openEdit(m)}><Pencil size={15} /></button>
                <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(m.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <AdminFormModal
          title={editId ? 'Modifier le match' : 'Nouveau match'}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <Field label="Jeu">
            <select value={form.jeu_id} onChange={e => set('jeu_id', e.target.value)}>
              {JEUX.map(j => <option key={j.id} value={j.id}>{j.label}</option>)}
            </select>
          </Field>
          <Field label="Équipe 1">
            <select value={form.equipe1_id} onChange={e => set('equipe1_id', e.target.value)}>
              <option value="">-- Sélectionner --</option>
              {equipes.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
          </Field>
          <Field label="Équipe 2">
            <select value={form.equipe2_id} onChange={e => set('equipe2_id', e.target.value)}>
              <option value="">-- Sélectionner --</option>
              {equipes.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
          </Field>
          <Field label="Date & heure">
            <input type="datetime-local" value={form.date_heure} onChange={e => set('date_heure', e.target.value)} />
          </Field>
          <Field label="Phase (ex: Groupe A, Demi-finale)">
            <input type="text" placeholder="Phase de groupes" value={form.phase} onChange={e => set('phase', e.target.value)} />
          </Field>
          <Field label="Statut">
            <select value={form.statut} onChange={e => set('statut', e.target.value)}>
              {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Score (ex: 2-1)">
            <input type="text" placeholder="—" value={form.score} onChange={e => set('score', e.target.value)} />
          </Field>
          {form.statut === 'termine' && (
            <Field label="Équipe gagnante">
              <select value={form.gagnant_id} onChange={e => set('gagnant_id', e.target.value)}>
                <option value="">-- Sélectionner --</option>
                {[
                  { id: form.equipe1_id, nom: equipes.find(e => String(e.id) === form.equipe1_id)?.nom },
                  { id: form.equipe2_id, nom: equipes.find(e => String(e.id) === form.equipe2_id)?.nom },
                ].filter(e => e.id && e.nom).map(e => (
                  <option key={e.id} value={e.id}>{e.nom}</option>
                ))}
              </select>
            </Field>
          )}
          {error && <p className="admin-error">{error}</p>}
        </AdminFormModal>
      )}
    </div>
  )
}
