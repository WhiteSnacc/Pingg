import { Link } from 'react-router-dom'
import type { Subpingg } from '../types'

interface SubpinggListProps {
  communities: Subpingg[]
}

function SubpinggList({ communities }: SubpinggListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Subpingg populer
      </h2>
      <ul className="space-y-1">
        {communities.map((community) => (
          <li key={community.id}>
            <Link
              to={`/p/${community.slug}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-forest"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint text-xs font-bold uppercase text-forest">
                {community.name.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">p/{community.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SubpinggList
