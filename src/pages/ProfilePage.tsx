import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { useAuth } from '../hooks/useAuth'
import {
  getPostsByAuthorId,
  getProfileById,
  updateProfile,
} from '../lib/queries'
import type { Post, Profile } from '../types'

function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (authLoading) {
      return () => {
        active = false
      }
    }
    if (!user) {
      return () => {
        active = false
      }
    }

    void Promise.all([
      getProfileById(user.id),
      getPostsByAuthorId(user.id),
    ])
      .then(([loadedProfile, loadedPosts]) => {
        if (active) {
          setError(null)
          setProfile(loadedProfile)
          setPosts(loadedPosts)
          setDisplayName(loadedProfile?.displayName ?? '')
          setBio(loadedProfile?.bio ?? '')
          setLoadedUserId(user.id)
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setProfile(null)
          setPosts([])
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Profil gagal dimuat.',
          )
          setLoadedUserId(user.id)
        }
      })
    return () => {
      active = false
    }
  }, [authLoading, user])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      return
    }
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const updatedProfile = await updateProfile(user.id, {
        display_name: displayName.trim(),
        bio: bio.trim(),
      })
      setProfile(updatedProfile)
      setMessage('Perubahan profil tersimpan.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Perubahan profil gagal disimpan.',
      )
    } finally {
      setSaving(false)
    }
  }

  const page = (content: ReactNode) => (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      {content}
    </div>
  )

  if (authLoading) {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p role="status" className="text-sm text-slate-500">
          Memuat profil...
        </p>
      </main>,
    )
  }

  if (!user) {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">Masuk untuk melihat profilmu.</p>
        <Link to="/login" className="mt-3 inline-block font-semibold text-forest">
          Masuk
        </Link>
      </main>,
    )
  }

  if (loadedUserId !== user.id) {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p role="status" className="text-sm text-slate-500">
          Memuat profil...
        </p>
      </main>,
    )
  }

  if (error && !profile) {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p role="alert" className="text-sm text-crimson">
          {error}
        </p>
      </main>,
    )
  }

  if (!profile) {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">
          Profil belum tersedia untuk akun ini.
        </p>
      </main>,
    )
  }

  return page(
    <main className="page-content mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-4">
      <section className="space-y-4 md:col-span-3">
        <div className="space-y-3.5 rounded-3xl border border-forest/20 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <span className="rounded-full bg-forest px-3.5 py-1.5 text-xs font-bold text-white">
              Postingan
            </span>
            <Link
              to="/submit"
              className="ml-auto rounded-full bg-crimson px-3.5 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
            >
              + Post Baru
            </Link>
          </div>
        </div>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Belum ada postingan aktif.
          </p>
        )}
      </section>

      <aside className="mx-auto w-full max-w-md md:col-span-1 md:max-w-none">
        <div className="space-y-5 rounded-3xl border border-forest/20 bg-white p-6 shadow-sm md:sticky md:top-20">
          <div className="flex flex-col items-center border-b border-gray-100 pb-4 text-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="mb-3 h-20 w-20 rounded-full border-2 border-forest object-cover"
              />
            ) : (
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-forest bg-mint text-2xl font-bold text-forest shadow-inner">
                {profile.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <h1 className="text-base font-bold leading-tight text-slate-800">
              {profile.displayName}
            </h1>
            <p className="mb-2 text-xs text-slate-500">@{profile.username}</p>
            <p className="mt-3 text-xs text-slate-500">
              {profile.postKarma} post karma · {profile.commentKarma} comment
              karma
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={(event) => void handleSubmit(event)}>
            <div>
              <label
                htmlFor="profile-display-name"
                className="mb-1 block pl-2 text-xs font-semibold text-slate-600"
              >
                Nama Tampilan
              </label>
              <input
                id="profile-display-name"
                type="text"
                maxLength={80}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full rounded-full border border-forest/30 bg-slate-50/50 px-4 py-2 text-xs outline-none transition focus:border-forest focus:bg-white focus:ring-1 focus:ring-forest"
              />
            </div>
            <div>
              <label
                htmlFor="profile-username"
                className="mb-1 block pl-2 text-xs font-semibold text-slate-600"
              >
                Username
              </label>
              <input
                id="profile-username"
                type="text"
                value={profile.username}
                readOnly
                className="w-full rounded-full border border-forest/30 bg-slate-100 px-4 py-2 text-xs text-slate-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="profile-bio"
                className="mb-1 block pl-2 text-xs font-semibold text-slate-600"
              >
                Bio
              </label>
              <textarea
                id="profile-bio"
                rows={2}
                maxLength={500}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tulis bio singkat..."
                className="w-full resize-none rounded-2xl border border-forest/30 bg-slate-50/50 px-4 py-2.5 text-xs outline-none transition focus:border-forest focus:bg-white focus:ring-1 focus:ring-forest"
              />
            </div>
            {error ? (
              <p role="alert" className="text-xs text-crimson">
                {error}
              </p>
            ) : null}
            {message ? (
              <p role="status" className="text-xs text-forest">
                {message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full rounded-full bg-forest py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-forest/90 disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </aside>
    </main>,
  )
}

export default ProfilePage
