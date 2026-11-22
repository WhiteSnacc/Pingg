import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { createSubpingg } from '../lib/queries'

function CreateCommunityPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const community = await createSubpingg({
        name: name.trim(),
        description: description.trim(),
        createdBy: user.id,
      })
      navigate(`/p/${community.slug}`)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Komunitas gagal dibuat.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="page-content mx-auto max-w-3xl px-4 py-6">
        <Link
          to="/communities"
          className="text-sm font-semibold text-forest"
        >
          ← Kembali ke komunitas
        </Link>
        <section className="mt-4 rounded-3xl border border-forest/20 bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-bold text-slate-800">
            Buat komunitas
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Buat Subpingg untuk topik yang ingin kamu diskusikan. Kamu akan
            menjadi moderator komunitas ini.
          </p>

          {authLoading ? (
            <p role="status" className="mt-5 text-sm text-slate-500">
              Memeriksa sesi...
            </p>
          ) : !user ? (
            <p className="mt-5 text-sm text-slate-600">
              <Link to="/login" className="font-semibold text-forest underline">
                Masuk
              </Link>{' '}
              untuk membuat komunitas.
            </p>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => void handleSubmit(event)}
            >
              <div>
                <label
                  htmlFor="community-name"
                  className="mb-1 block text-sm font-semibold text-slate-600"
                >
                  Nama Subpingg
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-forest">
                  <span className="pl-4 text-sm text-slate-400">p/</span>
                  <input
                    id="community-name"
                    required
                    minLength={3}
                    maxLength={32}
                    pattern="[a-z0-9_-]+"
                    title="Gunakan huruf kecil, angka, tanda hubung, atau garis bawah."
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="teknologi"
                    className="w-full rounded-xl bg-transparent px-2 py-3 text-sm outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  3–32 karakter: huruf kecil, angka, - atau _.
                </p>
              </div>
              <div>
                <label
                  htmlFor="community-description"
                  className="mb-1 block text-sm font-semibold text-slate-600"
                >
                  Deskripsi
                </label>
                <textarea
                  id="community-description"
                  rows={4}
                  maxLength={500}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Komunitas untuk berbagi dan berdiskusi tentang..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                />
              </div>
              {error ? (
                <p role="alert" className="text-sm text-crimson">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {submitting ? 'Membuat...' : 'Buat komunitas'}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}

export default CreateCommunityPage
