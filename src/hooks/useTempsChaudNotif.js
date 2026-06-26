import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useTempsChaudNotif() {
  const [notif, setNotif] = useState(false)

  useEffect(() => {
    const channel = supabase
      .channel('temps_chaud_notif')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'match' },
        (payload) => {
          if (payload.new?.temps_chaud === true) {
            setNotif(true)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { notif, dismiss: () => setNotif(false) }
}
