import type { Subpingg } from '../types'

interface SubpinggHeaderProps {
  community: Subpingg
}

function SubpinggHeader({ community }: SubpinggHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-forest/20 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-mint text-xl font-bold uppercase text-forest sm:h-20 sm:w-20">
          {community.name.slice(0, 2)}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-forest">
            p/{community.name}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">
            {community.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {community.description ?? 'Ruang diskusi komunitas Pingg!'}
          </p>
        </div>
      </div>
    </header>
  )
}

export default SubpinggHeader
