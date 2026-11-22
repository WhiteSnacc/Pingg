import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { searchPosts } from '../lib/queries'
import type { Post } from '../types'

type SearchState =
  | { key: string; status: 'loading' }
  | { key: string; status: 'error'; message: string }
  | { key: string; status: 'success'; posts: Post[] }

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const [reloadToken, setReloadToken] = useState(0)
  const requestKey = `${query}:${reloadToken}`
  const [searchState, setSearchState] = useState<SearchState>({
    key: '',
    status: 'loading',
  })

  useEffect(() => {
    let active = true
    if (query) {
      void searchPosts(query)
        .then((posts) => {
          if (active) {
            setSearchState({ key: requestKey, status: 'success', posts })
          }
        })
        .catch((error: unknown) => {
          if (active) {
            setSearchState({
              key: requestKey,
              status: 'error',
              message:
                error instanceof Error
                  ? error.message
                  : 'Pencarian gagal dilakukan.',
            })
          }
        })
    }
    return () => {
      active = false
    }
  }, [query, requestKey])

  const loading =
    searchState.status === 'loading' || searchState.key !== requestKey

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="page-content mx-auto max-w-4xl space-y-5 px-4 py-6">
        <header className="rounded-3xl border border-forest/20 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-forest">
            Pencarian
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">
            {query ? `Hasil untuk “${query}”` : 'Cari postingan'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Pencarian mencocokkan judul postingan, username, dan nama tampilan
            pengguna.
          </p>
        </header>

        {!query ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Masukkan judul atau nama pengguna di kolom cari.
          </p>
        ) : loading ? (
          <p role="status" className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Mencari postingan...
          </p>
        ) : searchState.status === 'error' ? (
          <div role="alert" className="rounded-2xl bg-white p-5">
            <p className="text-sm text-crimson">{searchState.message}</p>
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-forest underline"
              onClick={() => setReloadToken((token) => token + 1)}
            >
              Coba lagi
            </button>
          </div>
        ) : searchState.status === 'success' && searchState.posts.length > 0 ? (
          <section aria-label="Hasil pencarian" className="space-y-4">
            <p className="text-sm text-slate-500">
              {searchState.posts.length} postingan ditemukan
            </p>
            {searchState.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <div className="rounded-2xl bg-white p-5">
            <p className="text-sm text-slate-600">
              Tidak ada postingan aktif yang cocok.
            </p>
            <Link to="/" className="mt-3 inline-block text-sm text-forest underline">
              Kembali ke feed
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default SearchPage
