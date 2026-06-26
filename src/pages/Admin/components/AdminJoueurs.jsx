import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import AdminFormModal, { Field } from './AdminFormModal'

const EMPTY = { pseudo: '', role: '', equipe_id: '' }

export default function AdminJoueurs() {
  const [joueurs, setJoueurs] = useState([])
  const [equipes, setEquipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [])

  async function fetch() {
    const [jRes, eRes] = await Promise.all([
      supabase.from('joueur').select('*, equipe:equipe_id(id,nom)').order('pseudo'),
      supabase.from('equipe').select('id,nom').order('nom'),
    ])
    setJoueurs(jRes.data || [])
    setEquipes(eRes.data || [])
    setLoading(false)
  }

  function openCreate() { setForm(EMPTY); setEditId(null); setError(''); setOpen(true) }

  function openEdit(j) {
    setForm({ pseudo: j.pseudo || '', role: j.role || '', equipe_id: String(j.equipe_id || '') })
    setEditId(j.id)
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.pseudo.trim()) { setError('Le pseudo est requis'); return }
    setSaving(true)
    const payload = {
      pseudo: form.pseudo.trim(),
      role: form.role.trim() || null,
      equipe_id: form.equipe_id ? Number(form.equipe_id) : null,
    }
    const { error: err } = editId
      ? await supabase.from('joueur').update(payload).eq('id', editId)
      : await supabase.from('joueur').insert(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    setOpen(false)
    fetch()
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce joueur ?')) return
    await supabase.from('joueur').delete().eq('id', id)
    fetch()
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <span className="admin-count">{joueurs.length} joueur(s)</span>
        <button className="admin-add-btn" onClick={openCreate}>
          <Plus size={16} /> Nouveau
        </button>
      </div>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : joueurs.length === 0 ? (
        <p className="admin-empty">Aucun joueur.</p>
      ) : (
        <div className="admin-list">
          {joueurs.map(j => (
            <div key={j.id} className="admin-row">
              <div className="admin-row-main">
                <div className="admin-player-avatar">
                  {j.pseudo?.[0]?.toUpperCase()}
                </div>
                <div className="admin-row-info">
                  <span className="admin-row-title">{j.pseudo}</span>
                  <span className="admin-row-sub">
                    {j.role ? `${j.role} · ` : ''}{j.equipe?.nom || 'Sans équipe'}
                  </span>
                </div>
              </div>
              <div className="admin-row-actions">
                <button className="admin-icon-btn" onClick={() => openEdit(j)}><Pencil size={15} /></button>
                <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(j.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <AdminFormModal
          title={editId ? 'Modifier le joueur' : 'Nouveau joueur'}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <Field label="Pseudo">
            <input type="text" placeholder="Pseudo ingame" value={form.pseudo} onChange={e => set('pseudo', e.target.value)} />
          </Field>
          <Field label="Rôle (poste)">
            <input type="text" placeholder="Top, Jungle, Mid, ADC…" value={form.role} onChange={e => set('role', e.target.value)} />
          </Field>
          <Field label="Équipe">
            <select value={form.equipe_id} onChange={e => set('equipe_id', e.target.value)}>
              <option value="">Sans équipe</option>
              {equipes.map(eq => <option key={eq.id} value={eq.id}>{eq.nom}</option>)}
            </select>
          </Field>
          {error && <p className="admin-error">{error}</p>}
        </AdminFormModal>
      )}
    </div>
  )
}
