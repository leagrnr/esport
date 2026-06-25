import { useState } from 'react'
import { X, Trophy, Eye, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './AuthModal.css'

const ROLES = [
  { value: 'participant', label: 'Participant', icon: Trophy, desc: 'Je joue dans le tournoi' },
  { value: 'spectateur', label: 'Spectateur', icon: Eye, desc: 'Je suis le tournoi' },
]

export default function AuthModal({ isOpen, onClose }) {
  const { signIn, signUp, signOut, user, profile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('connexion')
  const [role, setRole] = useState('spectateur')
  const [form, setForm] = useState({ email: '', password: '', pseudo: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (tab === 'connexion') {
        await signIn(form.email, form.password)
        onClose()
      } else {
        if (!form.pseudo.trim()) { setError('Le pseudo est requis'); setLoading(false); return }
        await signUp(form.email, form.password, form.pseudo.trim(), role)
        setMessage('Compte créé ! Vérifie ton email pour confirmer.')
        setForm({ email: '', password: '', pseudo: '' })
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    onClose()
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-sheet" onClick={e => e.stopPropagation()}>
        <div className="auth-handle" />

        {user ? (
          <div className="auth-profile">
            <div className="auth-avatar">
              {(profile?.pseudo || user.email)?.[0]?.toUpperCase()}
            </div>
            <p className="auth-name">{profile?.pseudo || user.email}</p>
            {profile?.role && (
              <span className={`auth-role-badge auth-role-badge--${profile.role}`}>
                {profile.role}
              </span>
            )}
            {profile?.role === 'admin' && (
              <button
                className="auth-admin-link"
                onClick={() => { onClose(); navigate('/admin') }}
              >
                <ShieldCheck size={16} />
                Panneau admin
              </button>
            )}
            <button className="auth-logout" onClick={handleSignOut}>
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === 'connexion' ? 'auth-tab--active' : ''}`}
                onClick={() => { setTab('connexion'); setError(''); setMessage('') }}
              >
                Connexion
              </button>
              <button
                className={`auth-tab ${tab === 'inscription' ? 'auth-tab--active' : ''}`}
                onClick={() => { setTab('inscription'); setError(''); setMessage('') }}
              >
                Inscription
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {tab === 'inscription' && (
                <div className="auth-field">
                  <label>Pseudo</label>
                  <input
                    name="pseudo"
                    value={form.pseudo}
                    onChange={handleChange}
                    placeholder="Ton pseudo"
                    autoComplete="username"
                  />
                </div>
              )}

              <div className="auth-field">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ton@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label>Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete={tab === 'connexion' ? 'current-password' : 'new-password'}
                />
              </div>

              {tab === 'inscription' && (
                <div className="auth-field">
                  <label>Rôle</label>
                  <div className="auth-roles">
                    {ROLES.map(r => {
                      const Icon = r.icon
                      return (
                        <button
                          key={r.value}
                          type="button"
                          className={`auth-role-card ${role === r.value ? 'auth-role-card--active' : ''}`}
                          onClick={() => setRole(r.value)}
                        >
                          <Icon size={20} />
                          <span className="auth-role-label">{r.label}</span>
                          <span className="auth-role-desc">{r.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {error && <p className="auth-error">{error}</p>}
              {message && <p className="auth-success">{message}</p>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? '...' : tab === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>
          </>
        )}

        <button className="auth-close" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
