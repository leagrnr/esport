import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import AdminFormModal, { Field } from './AdminFormModal'

const ROLES = ['admin', 'participant', 'spectateur']

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ role: 'spectateur', points_classement: 0 })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [])

  async function fetch() {
    const { data } = await supabase
      .from('utilisateur')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  function openEdit(u) {
    setForm({ role: u.role || 'spectateur', points_classement: u.points_classement || 0 })
    setEditId(u.id)
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error: err } = await supabase
      .from('utilisateur')
      .update({ role: form.role, points_classement: Number(form.points_classement) })
      .eq('id', editId)
    setSaving(false)
    if (err) { setError(err.message); return }
    setOpen(false)
    fetch()
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  const roleBadgeClass = r => `admin-role-chip admin-role-chip--${r}`

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <span className="admin-count">{users.length} utilisateur(s)</span>
      </div>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : users.length === 0 ? (
        <p className="admin-empty">Aucun utilisateur.</p>
      ) : (
        <div className="admin-list">
          {users.map(u => (
            <div key={u.id} className="admin-row">
              <div className="admin-row-main">
                <div className="admin-player-avatar">
                  {(u.pseudo || u.email)?.[0]?.toUpperCase()}
                </div>
                <div className="admin-row-info">
                  <span className="admin-row-title">{u.pseudo || '—'}</span>
                  <span className="admin-row-sub">{u.email}</span>
                </div>
              </div>
              <div className="admin-row-actions">
                <span className={roleBadgeClass(u.role || 'spectateur')}>{u.role || 'spectateur'}</span>
                <button className="admin-icon-btn" onClick={() => openEdit(u)}><Pencil size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <AdminFormModal
          title="Modifier l'utilisateur"
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <Field label="Rôle">
            <select value={form.role} onChange={e => set('role', e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Points classement">
            <input type="number" min="0" value={form.points_classement} onChange={e => set('points_classement', e.target.value)} />
          </Field>
          {error && <p className="admin-error">{error}</p>}
        </AdminFormModal>
      )}
    </div>
  )
}
