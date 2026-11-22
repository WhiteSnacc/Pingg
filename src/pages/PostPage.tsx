import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentItem from '../components/CommentItem'
import Navbar from '../components/Navbar'
import VoteButtons from '../components/VoteButtons'
import { useAuth } from '../hooks/useAuth'
import { formatRelativeTime } from '../lib/formatRelativeTime'
import { createComment, getPostDetail } from '../lib/queries'
import { getYouTubeEmbedUrl } from '../lib/youtube'
import type { PostDetail } from '../types'

type PostLoadState =
  | { key: string; status: 'loading' }
  | { key: string; status: 'error'; message: string }
  | { key: string; status: 'success'; post: PostDetail | null }

function PostPage() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const [reloadToken, setReloadToken] = useState(0)
  const requestKey = `${id ?? ''}:${reloadToken}`
  const [postState, setPostState] = useState<PostLoadState>({
    key: '',
    status: 'loading',
  })
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (id) {
      void getPostDetail(id)
        .then((detail) => {
          if (active) {
            setPostState({ key: requestKey, status: 'success', post: detail })
          }
        })
        .catch((loadError: unknown) => {
          if (active) {
            setPostState({
              key: requestKey,
              status: 'error',
              message:
                loadError instanceof Error
                  ? loadError.message
                  : 'Postingan gagal dimuat.',
            })
          }
        })
    }
    return () => {
      active = false
    }
  }, [id, reloadToken, requestKey])

  const loading =
    authLoading || postState.status === 'loading' || postState.key !== requestKey

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Postingan tidak ditemukan</h1>
          <Link to="/" className="mt-4 inline-block text-forest">
            Kembali ke feed
          </Link>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p role="status" className="text-sm text-slate-500">
            Memuat postingan...
          </p>
        </main>
      </div>
    )
  }

  if (postState.status === 'error' && postState.key === requestKey) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p role="alert" className="text-sm text-crimson">
            {postState.message}
          </p>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-forest underline"
            onClick={() => setReloadToken((token) => token + 1)}
          >
            Coba lagi
          </button>
        </main>
      </div>
    )
  }

  const post = postState.status === 'success' ? postState.post : null
  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Postingan tidak ditemukan</h1>
          <Link to="/" className="mt-4 inline-block text-forest">
            Kembali ke feed
          </Link>
        </main>
      </div>
    )
  }

  const community = post.community
  const comments = post.comments
  const topLevelComments = comments.filter((comment) => !comment.parentId)
  const youtubeEmbedUrl = post.youtubeUrl
    ? getYouTubeEmbedUrl(post.youtubeUrl)
    : null

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = commentText.trim()
    if (!body || !user) {
      return
    }

    setSubmitting(true)
    setCommentError(null)
    try {
      await createComment(post.id, user.id, body)
      setCommentText('')
      setReloadToken((token) => token + 1)
    } catch (submitError) {
      setCommentError(
        submitError instanceof Error
          ? submitError.message
          : 'Komentar gagal dikirim.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="page-content mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 py-6 lg:grid-cols-3">
        <section
          className="min-w-0 space-y-4 lg:col-span-2"
          aria-label="Detail postingan dan komentar"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest transition hover:text-crimson"
          >
            <span aria-hidden="true">←</span> Kembali ke feed
          </Link>

          <article className="space-y-5 rounded-3xl border border-forest/20 bg-white p-5 shadow-sm sm:p-7">
            <header className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-forest bg-mint text-sm font-bold text-forest"
                  aria-hidden="true"
                >
                  {post.author.displayName
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-bold text-slate-800">
                      {post.author.displayName}
                    </span>
                    <span className="text-xs text-slate-400">
                      @{post.author.username}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    {community ? (
                      <Link
                        to={`/p/${community.slug}`}
                        className="rounded-full border border-forest/20 bg-mint/60 px-2 py-0.5 text-[10px] font-semibold text-forest"
                      >
                        p/{community.name}
                      </Link>
                    ) : null}
                    <time dateTime={post.createdAt}>
                      {formatRelativeTime(post.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Menu postingan"
                className="rounded-full p-2 text-slate-400 transition hover:bg-mint hover:text-forest"
              >
                •••
              </button>
            </header>

            <div className="space-y-3">
              <h1 className="text-xl font-bold leading-snug text-slate-800 sm:text-2xl">
                {post.title}
              </h1>
              {post.body ? (
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {post.body}
                </p>
              ) : null}
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={`Gambar untuk ${post.title}`}
                  loading="lazy"
                  className="max-h-112 w-full rounded-2xl border border-slate-100 object-cover"
                />
              ) : null}
              {post.youtubeUrl ? (
                youtubeEmbedUrl ? (
                  <div className="aspect-video overflow-hidden rounded-2xl bg-slate-100">
                    <iframe
                      src={youtubeEmbedUrl}
                      title={`Video YouTube: ${post.title}`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <p role="alert" className="text-sm text-crimson">
                    Link video YouTube tidak valid.
                  </p>
                )
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
              <VoteButtons
                targetId={post.id}
                targetType="post"
                score={post.score}
                viewerVote={post.viewerVote}
              />
              <span className="rounded-full border border-forest/20 bg-mint px-3 py-1.5 text-xs font-semibold text-forest">
                {post.commentCount} komentar
              </span>
              <button
                type="button"
                className="ml-auto rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-mint hover:text-forest"
                onClick={() => {
                  void navigator.clipboard.writeText(window.location.href)
                }}
              >
                ↗ Bagikan
              </button>
            </div>
          </article>

          <section
            className="space-y-5 rounded-3xl border border-forest/20 bg-white p-5 shadow-sm sm:p-7"
            aria-labelledby="comments-heading"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2
                  id="comments-heading"
                  className="text-lg font-bold text-slate-800"
                >
                  Diskusi
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {post.commentCount} komentar pada postingan ini
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-500">
                Urutkan
                <select className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:border-forest focus:outline-none">
                  <option>Terbaru</option>
                  <option>Terpopuler</option>
                </select>
              </label>
            </div>

            {user ? (
              <form className="flex gap-3" onSubmit={(event) => void handleCommentSubmit(event)}>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-white"
                  aria-hidden="true"
                >
                  {user.email?.slice(0, 1).toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 space-y-2">
                  <label htmlFor="comment-input" className="sr-only">
                    Tulis komentar
                  </label>
                  <textarea
                    id="comment-input"
                    rows={2}
                    required
                    maxLength={500}
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Ikut nimbrung di diskusi..."
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-forest focus:outline-none"
                  />
                  {commentError ? (
                    <p role="alert" className="text-xs text-crimson">
                      {commentError}
                    </p>
                  ) : null}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-forest px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                      {submitting ? 'Mengirim...' : 'Kirim komentar'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-sm text-slate-500">
                <Link to="/login" className="font-semibold text-forest underline">
                  Masuk
                </Link>{' '}
                untuk ikut berdiskusi.
              </p>
            )}

            <ol className="divide-y divide-slate-100">
              {topLevelComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  replies={comments.filter(
                    (reply) => reply.parentId === comment.id,
                  )}
                />
              ))}
            </ol>
          </section>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3 rounded-3xl border border-forest/20 bg-white p-6 shadow-sm">
            <span className="text-2xl" aria-hidden="true">
              💬
            </span>
            <h2 className="font-bold text-slate-800">Ruang diskusi</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Bagikan pengalaman dan rekomendasi dengan tetap ramah kepada
              sesama.
            </p>
            {community ? (
              <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                <Link
                  to={`/p/${community.slug}`}
                  className="font-bold text-forest"
                >
                  p/{community.name}
                </Link>
                <span className="mt-1 block">{community.description}</span>
              </div>
            ) : null}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default PostPage
