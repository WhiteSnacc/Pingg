import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../lib/formatRelativeTime'
import type { Post } from '../types'
import VoteButtons from './VoteButtons'

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  return (
    <article className="space-y-3 rounded-3xl border border-forest/20 bg-white p-5 shadow-sm transition hover:border-forest/50">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest bg-mint text-xs font-bold text-forest"
            aria-hidden="true"
          >
            {post.author.displayName
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 sm:text-sm">
                {post.author.displayName}
              </span>
              <span className="text-[11px] text-slate-400">
                @{post.author.username}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <Link
                to={`/p/${post.community.slug}`}
                className="rounded-full border border-forest/20 bg-mint/60 px-2 py-0.5 text-[10px] font-semibold text-forest"
              >
                p/{post.community.name}
              </Link>
              <time dateTime={post.createdAt}>
                · {formatRelativeTime(post.createdAt)}
              </time>
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label="Menu post"
          className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-mint/50 hover:text-forest"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </header>

      <div className="space-y-2">
        <h2 className="text-sm font-bold leading-snug text-slate-800 sm:text-base">
          <Link
            to={`/post/${post.id}`}
            className="text-slate-800 transition hover:text-forest"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
          {post.body}
        </p>
        {post.imageUrl ? (
          <Link to={`/post/${post.id}`} aria-label={`Buka ${post.title}`}>
            <img
              src={post.imageUrl}
              alt=""
              loading="lazy"
              className="max-h-80 w-full rounded-2xl border border-slate-100 object-cover"
            />
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
        <VoteButtons
          targetId={post.id}
          targetType="post"
          score={post.score}
          viewerVote={post.viewerVote}
        />
        <Link
          to={`/post/${post.id}`}
          className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-mint hover:text-forest"
        >
          {post.commentCount} Komentar
        </Link>
        <button
          type="button"
          className="ml-auto rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-mint hover:text-forest"
          onClick={() => {
            void navigator.clipboard.writeText(window.location.href)
          }}
        >
          <span className="hidden sm:inline">Bagikan</span>
          <span className="sm:hidden" aria-label="Bagikan">
            ↗
          </span>
        </button>
      </div>
    </article>
  )
}

export default PostCard
