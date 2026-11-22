import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function InboxPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="page-content mx-auto max-w-5xl px-4 py-8">
        <section
          className="flex min-h-[65vh] items-center justify-center"
          aria-labelledby="inbox-heading"
        >
          <div className="w-full max-w-lg rounded-3xl border border-forest/20 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mint text-3xl text-forest"
              aria-hidden="true"
            >
              ✉
            </div>
            <h1
              id="inbox-heading"
              className="text-xl font-bold text-slate-800 sm:text-2xl"
            >
              Tidak ada kotak masuk
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Belum ada pesan atau notifikasi untukmu. Kalau ada yang baru,
              nanti akan muncul di sini.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
            >
              Jelajahi feed
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default InboxPage
