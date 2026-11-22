import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center text-slate-800">
      <p className="text-sm font-bold uppercase tracking-wider text-forest">
        Pingg!
      </p>
      <h1 className="mt-2 text-3xl font-bold">Halaman tidak ditemukan</h1>
      <Link
        to="/"
        className="mt-5 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
      >
        Kembali ke feed
      </Link>
    </main>
  )
}

export default NotFoundPage
