import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import SubpinggList from '../components/SubpinggList'
import { getFeed, getSubpinggs } from '../lib/queries'
import type { Post, Subpingg } from '../types'

type FeedSort = 'terbaru' | 'teratas'
type FeedState =
  | { sort: FeedSort | null; status: 'loading' }
  | { sort: FeedSort; status: 'error'; message: string }
  | {
      sort: FeedSort
      status: 'success'
      posts: Post[]
      communities: Subpingg[]
    }

function FeedPage() {
  const [sortBy, setSortBy] = useState<FeedSort>('terbaru')
  const [reloadToken, setReloadToken] = useState(0)
  const [feedState, setFeedState] = useState<FeedState>({
    sort: null,
    status: 'loading',
  })
  const isLoading =
    feedState.sort !== sortBy || feedState.status === 'loading'

  useEffect(() => {
    let active = true
    void Promise.all([getFeed(sortBy), getSubpinggs()])
      .then(([posts, communities]) => {
        if (active) {
          setFeedState({ sort: sortBy, status: 'success', posts, communities })
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setFeedState({
            sort: sortBy,
            status: 'error',
            message:
              error instanceof Error ? error.message : 'Feed gagal dimuat.',
          })
        }
      })
    return () => {
      active = false
    }
  }, [reloadToken, sortBy])

  const changeSort = (sort: FeedSort) => setSortBy(sort)
  const posts =
    !isLoading && feedState.status === 'success' ? feedState.posts : []
  const communities =
    !isLoading && feedState.status === 'success'
      ? feedState.communities
      : []
  const error =
    !isLoading && feedState.status === 'error' ? feedState.message : null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="page-content mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 py-6 lg:grid-cols-3">
        <section
          className="min-w-0 space-y-4 lg:col-span-2"
          aria-label="Feed postingan"
        >
          <div className="flex justify-end border-b border-slate-200 pb-3">
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Urutkan postingan"
            >
              <button
                type="button"
                aria-pressed={sortBy === 'terbaru'}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  sortBy === 'terbaru'
                    ? 'bg-forest font-bold text-white'
                    : 'font-medium text-slate-600 hover:bg-mint hover:text-forest'
                }`}
                onClick={() => changeSort('terbaru')}
              >
                Terbaru
              </button>
              <button
                type="button"
                aria-pressed={sortBy === 'teratas'}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  sortBy === 'teratas'
                    ? 'bg-forest font-bold text-white'
                    : 'font-medium text-slate-600 hover:bg-mint hover:text-forest'
                }`}
                onClick={() => changeSort('teratas')}
              >
                Teratas
              </button>
            </div>
          </div>

          {isLoading ? (
            <p role="status" className="rounded-2xl bg-white p-5 text-slate-500">
              Memuat feed...
            </p>
          ) : error ? (
            <div role="alert" className="rounded-2xl bg-white p-5">
              <p className="text-sm text-crimson">{error}</p>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-forest underline"
                onClick={() => setReloadToken((token) => token + 1)}
              >
                Coba lagi
              </button>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="rounded-2xl bg-white p-5 text-sm text-slate-500">
              Belum ada postingan aktif.
            </p>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          {!isLoading && !error ? (
            <SubpinggList communities={communities.slice(0, 5)} />
          ) : null}
          <section className="rounded-2xl border border-forest/20 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-800">Tentang Pingg!</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Ruang untuk berbagi cerita, bertanya, dan berdiskusi bersama
              komunitas yang kamu suka.
            </p>
          </section>
        </aside>
      </main>
    </div>
  )
}

export default FeedPage
