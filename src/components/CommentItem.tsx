import { formatRelativeTime } from '../lib/formatRelativeTime'
import type { Comment } from '../types'
import VoteButtons from './VoteButtons'

interface CommentItemProps {
  comment: Comment
  replies?: Comment[]
  depth?: number
}

function CommentItem({
  comment,
  replies = [],
  depth = 0,
}: CommentItemProps) {
  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <article className="flex gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-bold text-forest"
          aria-hidden="true"
        >
          {comment.author.displayName
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-sm font-bold text-slate-800">
              {comment.author.displayName}
            </h3>
            <span className="text-xs text-slate-400">
              @{comment.author.username}
            </span>
            <time
              dateTime={comment.createdAt}
              className="text-xs text-slate-400"
            >
              · {formatRelativeTime(comment.createdAt)}
            </time>
          </header>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {comment.body}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
            <VoteButtons
              targetId={comment.id}
              targetType="comment"
              score={comment.score}
              viewerVote={comment.viewerVote}
              compact
            />
            <button
              type="button"
              className="transition hover:text-forest"
              onClick={() => document.getElementById('comment-input')?.focus()}
            >
              Balas
            </button>
          </div>
          {replies.length > 0 ? (
            <ol className="mt-4 ml-2 border-l-2 border-mint pl-4">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                />
              ))}
            </ol>
          ) : null}
        </div>
      </article>
    </li>
  )
}

export default CommentItem
