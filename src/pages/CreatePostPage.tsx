import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { createPost, getSubpinggs } from '../lib/queries'
import { getYouTubeEmbedUrl } from '../lib/youtube'
import type { Subpingg } from '../types'

function CreatePostPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [communities, setCommunities] = useState<Subpingg[]>([])
  const [loadingCommunities, setLoadingCommunities] = useState(true)
  const [communityError, setCommunityError] = useState<string | null>(null)
  const [subpinggId, setSubpinggId] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void getSubpinggs()
      .then((data) => {
        if (active) {
          setCommunities(data)
          setSubpinggId(data[0]?.id ?? '')
          setLoadingCommunities(false)
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setCommunityError(
            error instanceof Error
              ? error.message
              : 'Daftar Subpingg gagal dimuat.',
          )
          setLoadingCommunities(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      return
    }
    if (videoUrl.trim() && !getYouTubeEmbedUrl(videoUrl.trim())) {
      setSubmitError('Gunakan URL video YouTube yang valid.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const postId = await createPost({
        subpinggId,
        authorId: user.id,
        title: title.trim(),
        body: body.trim(),
        imageUrl: imageUrl.trim() || null,
        videoUrl: videoUrl.trim() || null,
      })
      navigate(`/post/${postId}`)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Post gagal diterbitkan.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="page-content mx-auto max-w-3xl px-4 py-6">
        <Link to="/" className="text-sm font-semibold text-forest">
          ← Kembali ke feed
        </Link>
        <section className="mt-4 rounded-3xl border border-forest/20 bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-bold text-slate-800">Buat postingan</h1>
          {authLoading ? (
            <p role="status" className="mt-4 text-sm text-slate-500">
              Memeriksa sesi...
            </p>
          ) : !user ? (
            <p className="mt-4 text-sm text-slate-600">
              <Link to="/login" className="font-semibold text-forest underline">
                Masuk
              </Link>{' '}
              untuk membuat postingan.
            </p>
          ) : communityError ? (
            <p role="alert" className="mt-4 text-sm text-crimson">
              {communityError}
            </p>
          ) : loadingCommunities ? (
            <p role="status" className="mt-4 text-sm text-slate-500">
              Memuat Subpingg...
            </p>
          ) : communities.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Belum ada Subpingg untuk menerbitkan post.
            </p>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => void handleSubmit(event)}
            >
              <div>
                <label
                  htmlFor="post-subpingg"
                  className="mb-1 block text-sm font-semibold text-slate-600"
                >
                  Subpingg
                </label>
                <select
                  id="post-subpingg"
                  required
                  value={subpinggId}
                  onChange={(event) => setSubpinggId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-forest focus:outline-none"
                >
                  {communities.map((community) => (
                    <option key={community.id} value={community.id}>
                      p/{community.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="post-title"
                  className="mb-1 block text-sm font-semibold text-slate-600"
                >
                  Judul
                </label>
                <input
                  id="post-title"
                  required
                  maxLength={300}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="post-body"
                  className="mb-1 block text-sm font-semibold text-slate-600"
                >
                  Isi post
                </label>
                <textarea
                  id="post-body"
                  rows={6}
                  maxLength={10000}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="post-image-url"
                  className="mb-1 block text-sm font-semibold text-slate-600"
                >
                  URL gambar (opsional)
                </label>
                <input
                  id="post-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="post-video-url"
                  className="mb-1 block text-sm font-semibold text-slate-600"
                >
                  URL video YouTube (opsional)
                </label>
                <input
                  id="post-video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                />
              </div>
              {submitError ? (
                <p role="alert" className="text-sm text-crimson">
                  {submitError}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {submitting ? 'Menerbitkan...' : 'Terbitkan post'}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}

export default CreatePostPage
