import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTempsChaudNotif } from '../hooks/useTempsChaudNotif'
import './TempsChaudBanner.css'

export default function TempsChaudBanner() {
  const { notif, dismiss } = useTempsChaudNotif()
  const navigate = useNavigate()

  if (!notif) return null

  function goToPronos() {
    dismiss()
    navigate('/match')
  }

  return (
    <div className="tcb-overlay">
      <div className="tcb-modal">
        <div className="tcb-modal-icon">
          <Flame size={32} />
        </div>
        <h2 className="tcb-modal-title">Temps chaud !</h2>
        <p className="tcb-modal-desc">
          Un match en cours double les pixels du Pixel War.<br />
          C'est le moment de placer tes pronostics !
        </p>
        <div className="tcb-modal-actions">
          <button className="tcb-btn tcb-btn--primary" onClick={goToPronos}>
            Accéder aux pronostics
          </button>
          <button className="tcb-btn tcb-btn--secondary" onClick={dismiss}>
            Remettre à plus tard
          </button>
        </div>
      </div>
    </div>
  )
}
