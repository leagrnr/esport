import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import AdminFormModal, { Field } from './AdminFormModal'

const EMPTY = { nom: '', logo_url: '' }

export default function AdminEquipes() {
  const [equipes, setEquipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [])

  async function fetch() {
    const { data } = await supabase.from('equipe').select('*').order('nom')
    setEquipes(data || [])
    setLoading(false)
  }

  function openCreate() { setForm(EMPTY); setEditId(null); setError(''); setOpen(true) }

  function openEdit(e) {
    setForm({ nom: e.nom || '', logo_url: e.logo_url || '' })
    setEditId(e.id)
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.nom.trim()) { setError('Le nom est requis'); return }
    setSaving(true)
    const payload = { nom: form.nom.trim(), logo_url: form.logo_url.trim() || null }
    const { error: err } = editId
      ? await supabase.from('equipe').update(payload).eq('id', editId)
      : await supabase.from('equipe').insert(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    setOpen(false)
    fetch()
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette équipe ?')) return
    await supabase.from('equipe').delete().eq('id', id)
    fetch()
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <span className="admin-count">{equipes.length} équipe(s)</span>
        <button className="admin-add-btn" onClick={openCreate}>
          <Plus size={16} /> Nouvelle
        </button>
      </div>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : equipes.length === 0 ? (
        <p className="admin-empty">Aucune équipe.</p>
      ) : (
        <div className="admin-list">
          {equipes.map(eq => (
            <div key={eq.id} className="admin-row">
              <div className="admin-row-main">
                {eq.logo_url ? (
                  <img src={eq.logo_url} alt={eq.nom} className="admin-team-logo" />
                ) : (
                  <div className="admin-team-logo admin-team-logo--placeholder" />
                )}
                <span className="admin-row-title">{eq.nom}</span>
              </div>
              <div className="admin-row-actions">
                <button className="admin-icon-btn" onClick={() => openEdit(eq)}><Pencil size={15} /></button>
                <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(eq.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <AdminFormModal
          title={editId ? "Modifier l'équipe" : 'Nouvelle équipe'}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <Field label="Nom">
            <input type="text" placeholder="Nom de l'équipe" value={form.nom} onChange={e => set('nom', e.target.value)} />
          </Field>
          <Field label="URL du logo">
            <input type="text" placeholder="https://…" value={form.logo_url} onChange={e => set('logo_url', e.target.value)} />
          </Field>
          {form.logo_url && (
            <img src={form.logo_url} alt="preview" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, background: '#1a1a1a' }} />
          )}
          {error && <p className="admin-error">{error}</p>}
        </AdminFormModal>
      )}
    </div>
  )
}
