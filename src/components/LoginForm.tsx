import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (!supabaseClient) {
      setMessage('Konfigurasi Supabase belum tersedia. Isi variabel di file .env.')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage(error.message)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Could not sign in with Supabase.', error)
      setMessage('Login gagal. Periksa koneksi lalu coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="w-full max-w-md rounded-2xl border border-forest/20 bg-mint p-8 shadow-2xl"
    >
      <h1 className="mb-4 text-center text-4xl font-bold text-forest">LOG IN</h1>
      <p className="my-4 text-center text-sm text-gray-600">
        Selamat datang di Pingg!
        <br />
        Mohon isi form untuk masuk ke dalam website.
      </p>
      <label htmlFor="login-email" className="font-medium text-green-900">
        Email
      </label>
      <input
        id="login-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Masukkan email anda..."
        className="mb-3 w-full rounded-lg border border-gray-400 bg-white px-2 py-2 placeholder:text-gray-400"
      />
      <label htmlFor="login-password" className="font-medium text-green-900">
        Password
      </label>
      <input
        id="login-password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Masukkan password anda..."
        className="mb-2 w-full rounded-lg border border-gray-400 bg-white px-2 py-2 placeholder:text-gray-400"
      />
      {message ? (
        <p role="alert" className="mt-3 text-sm text-crimson">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="my-3 w-full rounded-2xl bg-forest p-2 text-center font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {submitting ? 'Memproses...' : 'Masuk'}
      </button>
      <p className="text-sm text-slate-700">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Buat akun
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
