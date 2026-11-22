import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSubpinggs } from '../lib/queries'
import type { Subpingg } from '../types'

function CommunitiesPage() {
  const [communities, setCommunities] = useState<Subpingg[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void getSubpinggs()
      .then((data) => {
        if (active) {
          setCommunities(data)
          setLoading(false)
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Komunitas gagal dimuat.',
          )
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="page-content mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <nav aria-label="Menu komunitas" className="sticky top-24 space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Jelajahi
                </h2>
                <a
                  href="#semua"
                  className="flex items-center gap-3 rounded-xl bg-mint px-3 py-2.5 text-sm font-bold text-forest"
                >
                  <span className="w-5 text-center" aria-hidden="true">
                    ⌂
                  </span>
                  Semua komunitas
                </a>
                <a
                  href="#populer"
                  className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-forest"
                >
                  <span className="w-5 text-center" aria-hidden="true">
                    ↗
                  </span>
                  Populer
                </a>
                <a
                  href="#baru"
                  className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-forest"
                >
                  <span className="w-5 text-center" aria-hidden="true">
                    ✦
                  </span>
                  Komunitas baru
                </a>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Kategori
                </h2>
                {communities.map((community) => (
                  <Link
                    key={community.id}
                    to={`/p/${community.slug}`}
                    className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-forest"
                  >
                    p/{community.name}
                  </Link>
                ))}
              </section>
              <Link
                to="/communities/create"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-forest px-4 py-2.5 text-sm font-bold text-forest transition hover:bg-mint"
              >
                <span aria-hidden="true">＋</span> Buat komunitas
              </Link>
            </nav>
          </aside>

          <section
            id="semua"
            className="min-w-0 space-y-5"
            aria-labelledby="community-heading"
          >
            <header className="flex flex-col gap-4 rounded-3xl border border-forest/20 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-forest">
                  Temukan ruangmu
                </p>
                <h1
                  id="community-heading"
                  className="mt-1 text-2xl font-bold text-slate-800"
                >
                  Jelajahi komunitas
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Temukan orang-orang yang tertarik dengan hal yang sama.
                </p>
              </div>
              <Link
                to="/communities/create"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
              >
                <span aria-hidden="true">＋</span> Buat komunitas
              </Link>
            </header>

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-1 pb-3">
              <div
                className="flex items-center gap-1"
                role="tablist"
                aria-label="Urutkan komunitas"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected="true"
                  className="rounded-full bg-forest px-4 py-2 text-xs font-bold text-white"
                >
                  Untukmu
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  className="rounded-full px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-mint hover:text-forest"
                >
                  Populer
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  className="hidden rounded-full px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-mint hover:text-forest sm:inline-flex"
                >
                  Terbaru
                </button>
              </div>
              <span className="text-xs text-slate-400">Komunitas pilihan</span>
            </div>

            {loading ? (
              <p role="status" className="rounded-2xl bg-white p-5 text-sm text-slate-500">
                Memuat komunitas...
              </p>
            ) : error ? (
              <p role="alert" className="rounded-2xl bg-white p-5 text-sm text-crimson">
                {error}
              </p>
            ) : communities.length === 0 ? (
              <p className="rounded-2xl bg-white p-5 text-sm text-slate-500">
                Belum ada Subpingg.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {communities.map((community) => (
                  <article
                    key={community.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-forest/40 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint font-bold uppercase text-forest">
                        {community.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/p/${community.slug}`}
                          className="font-bold text-slate-800 hover:text-forest"
                        >
                          {community.name}
                        </Link>
                        <p className="text-xs text-slate-400">
                          p/{community.name}
                        </p>
                      </div>
                      <Link
                        to={`/p/${community.slug}`}
                        className="shrink-0 rounded-full border border-forest px-4 py-1.5 text-xs font-bold text-forest transition hover:bg-mint"
                      >
                        Buka
                      </Link>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {community.description ?? 'Ruang diskusi komunitas Pingg!'}
                    </p>
                    <p className="mt-4 text-xs text-slate-400">
                      Dibuat{' '}
                      {new Intl.DateTimeFormat('id-ID', {
                        dateStyle: 'medium',
                      }).format(new Date(community.createdAt))}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default CommunitiesPage
