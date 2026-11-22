import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { supabaseClient } from '../lib/supabase'

const settingsTabs = [
  { id: 'account', label: 'Account' },
  { id: 'profile', label: 'Profile' },
  { id: 'preferences', label: 'Feed Preferences' },
  { id: 'notifications', label: 'Notifications' },
] as const

type SettingsTab = (typeof settingsTabs)[number]['id']

function SettingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [saved, setSaved] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const handleLogout = async () => {
    if (!supabaseClient) {
      setLogoutError('Supabase belum dikonfigurasi.')
      return
    }

    setLoggingOut(true)
    setLogoutError(null)
    try {
      const { error } = await supabaseClient.auth.signOut()
      if (error) {
        throw error
      }
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : 'Gagal keluar dari akun.',
      )
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <Navbar />
      <main className="page-content mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-maroon pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-forest">
              User Settings
            </h1>
            <p className="text-sm text-slate-500">
              Kelola akun, profil, dan preferensi akun Pingg! milikmu.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-forest/20 bg-mint px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-emerald-100"
          >
            ← Kembali ke Home
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <nav aria-label="Pengaturan akun" className="space-y-1">
            {settingsTabs.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    active
                      ? 'bg-forest text-white'
                      : 'text-slate-600 hover:bg-mint hover:text-forest'
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSaved(false)
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <section className="space-y-6 rounded-xl border border-forest/20 bg-white p-6 shadow-sm md:col-span-3">
            {activeTab === 'account' ? (
              <>
                <h2 className="border-b border-slate-200 pb-3 text-xl font-semibold text-slate-800">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Email Address
                    <input
                      type="email"
                      value={user?.email ?? ''}
                      readOnly
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-forest focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Change Password
                    <input
                      type="password"
                      placeholder="New Password"
                      className="mt-1 mb-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-forest focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-forest focus:outline-none"
                    />
                  </label>
                </div>
                <div className="border-t border-slate-200 pt-5">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Keluar dari akun
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Kamu perlu masuk kembali untuk menggunakan fitur akun.
                  </p>
                  {logoutError ? (
                    <p role="alert" className="mt-3 text-sm text-crimson">
                      {logoutError}
                    </p>
                  ) : null}
                  {user ? (
                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={() => void handleLogout()}
                      className="mt-3 rounded-lg border border-crimson px-4 py-2 text-sm font-semibold text-crimson transition hover:bg-crimson hover:text-white disabled:opacity-60"
                    >
                      {loggingOut ? 'Keluar...' : 'Log out'}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="mt-3 inline-block text-sm font-semibold text-forest underline"
                    >
                      Masuk
                    </Link>
                  )}
                </div>
              </>
            ) : null}
            {activeTab === 'profile' ? (
              <>
                <h2 className="border-b border-slate-200 pb-3 text-xl font-semibold text-slate-800">
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Display Name
                    <input
                      type="text"
                      defaultValue="Rio Sianipar"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-forest focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Bio
                    <textarea
                      rows={3}
                      defaultValue="Anak Ilmu Komputer USU | Frontend Dev"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-forest focus:outline-none"
                    />
                  </label>
                </div>
              </>
            ) : null}
            {activeTab === 'preferences' ? (
              <>
                <h2 className="border-b border-slate-200 pb-3 text-xl font-semibold text-slate-800">
                  Feed Preferences
                </h2>
                <label className="flex items-center justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium text-slate-800">
                      Adult content (NSFW)
                    </span>
                    <span className="text-xs text-slate-500">
                      Tampilkan postingan berlabel NSFW di beranda.
                    </span>
                  </span>
                  <input type="checkbox" className="h-4 w-4 accent-forest" />
                </label>
              </>
            ) : null}
            {activeTab === 'notifications' ? (
              <>
                <h2 className="border-b border-slate-200 pb-3 text-xl font-semibold text-slate-800">
                  Notification Settings
                </h2>
                <label className="flex items-center justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium text-slate-800">
                      Email Notifications
                    </span>
                    <span className="text-xs text-slate-500">
                      Terima pemberitahuan lewat email.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-forest"
                  />
                </label>
              </>
            ) : null}
            <div className="mt-8 flex justify-end border-t border-slate-200 pt-4">
              <button
                type="button"
                className="rounded-lg bg-forest px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                onClick={() => setSaved(true)}
              >
                {saved ? 'Changes Saved' : 'Save Changes'}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
