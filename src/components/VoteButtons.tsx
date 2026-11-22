import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { setCommentVote, setPostVote } from '../lib/queries'
import type { VoteValue } from '../types'

interface VoteButtonsProps {
  targetId: string
  targetType: 'post' | 'comment'
  score: number
  viewerVote: VoteValue
  compact?: boolean
}

function VoteButtons({
  targetId,
  targetType,
  score,
  viewerVote,
  compact = false,
}: VoteButtonsProps) {
  const { user } = useAuth()
  const [vote, setVote] = useState<VoteValue>(viewerVote)
  const [currentScore, setCurrentScore] = useState(score)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async (nextVote: 1 | -1) => {
    if (!user) {
      setError('Masuk untuk memberikan vote.')
      return
    }

    setPending(true)
    setError(null)
    const nextValue = vote === nextVote ? null : nextVote
    try {
      const nextScore =
        targetType === 'post'
          ? await setPostVote(targetId, user.id, nextValue)
          : await setCommentVote(targetId, user.id, nextValue)
      setCurrentScore(nextScore)
      setVote(nextValue ?? 0)
    } catch (voteError) {
      setError(
        voteError instanceof Error
          ? voteError.message
          : 'Vote gagal disimpan.',
      )
    } finally {
      setPending(false)
    }
  }

  const buttonSize = compact ? 'px-2 py-1' : 'px-2.5 py-1'

  return (
    <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold text-slate-600">
      <button
        type="button"
        aria-label={`Upvote, ${currentScore} suara`}
        aria-pressed={vote === 1}
        disabled={pending}
        className={`${buttonSize} rounded-full transition hover:bg-mint hover:text-forest ${
          vote === 1 ? 'bg-mint text-forest' : ''
        }`}
        onClick={() => void handleVote(1)}
      >
        ▲ <span className="ml-1">{currentScore}</span>
      </button>
      <span className="text-slate-300" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        aria-label="Downvote"
        aria-pressed={vote === -1}
        disabled={pending}
        className={`rounded-full px-2 py-1 transition hover:bg-crimson/10 hover:text-crimson ${
          vote === -1 ? 'bg-crimson/10 text-crimson' : ''
        }`}
        onClick={() => void handleVote(-1)}
      >
        ▼
      </button>
      {error ? (
        <span role="alert" className="ml-2 text-xs text-crimson">
          {!user ? (
            <Link to="/login" className="underline">
              {error}
            </Link>
          ) : (
            error
          )}
        </span>
      ) : null}
    </div>
  )
}

export default VoteButtons
