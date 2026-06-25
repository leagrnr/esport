import { X } from 'lucide-react'
import './AdminFormModal.css'

export default function AdminFormModal({ title, onClose, onSubmit, loading, children }) {
  return (
    <div className="afm-overlay" onClick={onClose}>
      <div className="afm-sheet" onClick={e => e.stopPropagation()}>
        <div className="afm-handle" />
        <div className="afm-header">
          <h2 className="afm-title">{title}</h2>
          <button className="afm-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form className="afm-form" onSubmit={onSubmit}>
          {children}
          <button className="afm-submit" type="submit" disabled={loading}>
            {loading ? '...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div className="afm-field">
      <label className="afm-label">{label}</label>
      {children}
    </div>
  )
}
