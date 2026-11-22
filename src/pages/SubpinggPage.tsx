import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import SubpinggHeader from '../components/SubpinggHeader'
import SubpinggList from '../components/SubpinggList'
import { getPostsBySubpingg, getSubpinggs } from '../lib/queries'
import type { Post, Subpingg } from '../types'

type SubpinggState =
  | { key: string; status: 'loading' }
  | { key: string; status: 'error'; message: string }
  | {
      key: string
      status: 'success'
      community: Subpingg | null
      communities: Subpingg[]
      posts: Post[]
    }

function SubpinggPage() {
  const { subpingg } = useParams()
  const [reloadToken, setReloadToken] = useState(0)
  const requestKey = `${subpingg ?? ''}:${reloadToken}`
  const [state, setState] = useState<SubpinggState>({
    key: '',
    status: 'loading',
  })

  useEffect(() => {
    let active = true
    void getSubpinggs()
      .then(async (communities) => {
        const community =
          communities.find(
            (item) => item.slug.toLowerCase() === subpingg?.toLowerCase(),
          ) ?? null
        const posts = community
          ? await getPostsBySubpingg(community.name)
          : []
        if (active) {
          setState({ key: requestKey, status: 'success', community, communities, posts })
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            key: requestKey,
            status: 'error',
            message:
              error instanceof Error ? error.message : 'Subpingg gagal dimuat.',
          })
        }
      })
    return () => {
      active = false
    }
  }, [requestKey, reloadToken, subpingg])

  const page = (content: ReactNode) => (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      {content}
    </div>
  )

  if (state.status === 'loading' || state.key !== requestKey) {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p role="status" className="text-sm text-slate-500">
          Memuat Subpingg...
        </p>
      </main>,
    )
  }

  if (state.status === 'error') {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p role="alert" className="text-sm text-crimson">
          {state.message}
        </p>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-forest underline"
          onClick={() => setReloadToken((token) => token + 1)}
        >
          Coba lagi
        </button>
      </main>,
    )
  }

  if (!state.community) {
    return page(
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Subpingg tidak ditemukan</h1>
        <Link to="/communities" className="mt-4 inline-block text-forest">
          Jelajahi komunitas
        </Link>
      </main>,
    )
  }

  return page(
    <main className="page-content mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <section className="min-w-0 space-y-4 lg:col-span-2">
          <SubpinggHeader community={state.community} />
          <div className="flex justify-end border-b border-slate-200 pb-3">
            <Link
              to="/"
              className="text-sm font-semibold text-forest hover:text-crimson"
            >
              Lihat semua feed
            </Link>
          </div>
          {state.posts.length > 0 ? (
            state.posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">
              Belum ada postingan aktif di Subpingg ini.
            </p>
          )}
        </section>
        <aside className="space-y-4 lg:sticky lg:top-24">
          <SubpinggList communities={state.communities} />
          <section className="rounded-3xl border border-forest/20 bg-white p-6 shadow-sm">
            <span className="text-2xl" aria-hidden="true">
              💬
            </span>
            <h2 className="mt-2 font-bold text-slate-800">Ruang diskusi</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Bagikan pengalaman dan rekomendasi dengan tetap ramah kepada
              sesama.
            </p>
          </section>
        </aside>
      </div>
    </main>,
  )
}

export default SubpinggPage
