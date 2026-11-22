import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function RegisterForm() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
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
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      })
      if (error) {
        setMessage(error.message)
      } else if (data.session) {
        navigate('/')
      } else {
        setMessage('Akun berhasil dibuat. Cek email untuk konfirmasi pendaftaran.')
      }
    } catch (error) {
      console.error('Could not register with Supabase.', error)
      setMessage('Pendaftaran gagal. Periksa koneksi lalu coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="w-full max-w-md rounded-2xl border border-forest/20 bg-mint p-8 shadow-2xl"
    >
      <h1 className="mb-4 text-center text-4xl font-bold text-forest">
        SIGN IN
      </h1>
      <p className="my-4 text-center text-sm text-gray-600">
        Selamat datang di Pingg!
        <br />
        Mohon isi form untuk membuat akun.
      </p>
      <label htmlFor="register-name" className="font-medium text-green-900">
        Nama
      </label>
      <input
        id="register-name"
        type="text"
        autoComplete="name"
        required
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        placeholder="Masukkan nama anda..."
        className="mb-3 w-full rounded-lg border border-gray-400 bg-white px-2 py-2 placeholder:text-gray-400"
      />
      <label htmlFor="register-email" className="font-medium text-green-900">
        Email
      </label>
      <input
        id="register-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Masukkan email anda..."
        className="mb-3 w-full rounded-lg border border-gray-400 bg-white px-2 py-2 placeholder:text-gray-400"
      />
      <label htmlFor="register-password" className="font-medium text-green-900">
        Password
      </label>
      <input
        id="register-password"
        type="password"
        autoComplete="new-password"
        minLength={6}
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Buat password (minimal 6 karakter)"
        className="mb-2 w-full rounded-lg border border-gray-400 bg-white px-2 py-2 placeholder:text-gray-400"
      />
      {message ? (
        <p role="status" className="mt-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="my-3 w-full rounded-2xl bg-forest p-2 text-center font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {submitting ? 'Memproses...' : 'Buat akun'}
      </button>
      <p className="text-sm text-slate-700">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
