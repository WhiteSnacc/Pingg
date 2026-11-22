import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabaseClient } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(supabaseClient !== null)

  useEffect(() => {
    const client = supabaseClient
    if (!client) {
      return
    }

    let active = true
    const loadSession = async () => {
      try {
        const { data, error } = await client.auth.getSession()
        if (error) {
          console.error('Could not load the current Supabase session.', error)
        }
        if (active) {
          setSession(data.session)
          setLoading(false)
        }
      } catch (error) {
        console.error('Could not load the current Supabase session.', error)
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadSession()
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return { user: session?.user ?? null, session, loading }
}
