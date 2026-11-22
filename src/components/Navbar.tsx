import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Untuk Anda', end: true },
  { to: '/communities', label: 'Komunitas', end: false },
  { to: '/inbox', label: 'Kotak Masuk', end: false },
  { to: '/profile', label: 'Anda', end: false },
  { to: '/settings', label: 'Pengaturan', end: false },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="site-nav sticky top-0 left-0 z-50 w-full border-b-2 border-maroon bg-mint">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-accordion"
            aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="flex h-5 w-6 flex-col justify-between border-none bg-transparent md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="h-[3px] w-full rounded bg-forest" />
            <span className="h-[3px] w-full rounded bg-forest" />
            <span className="h-[3px] w-full rounded bg-forest" />
          </button>
          <NavLink
            to="/"
            className="shrink-0 text-lg font-bold tracking-tight text-forest no-underline sm:text-xl"
            aria-label="Pingg! beranda"
          >
            Pingg<span className="text-crimson">!</span>
          </NavLink>
        </div>

        <form
          className="flex max-w-[200px] flex-1 items-center rounded-full border border-forest bg-white px-3 py-1.5 sm:max-w-[300px]"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="search"
            aria-label="Cari"
            placeholder="Cari..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </form>

        <ul className="m-0 hidden list-none items-center gap-6 p-0 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className="nav-link text-sm"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div
        id="mobile-accordion"
        className={`mobile-accordion md:hidden ${menuOpen ? '' : 'hidden'}`}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className="nav-link text-sm"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
