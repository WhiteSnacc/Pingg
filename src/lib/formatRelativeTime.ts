export function formatRelativeTime(date: string): string {
  const elapsedHours = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / (60 * 60 * 1000)),
  )

  if (elapsedHours < 24) {
    return new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' }).format(
      -elapsedHours,
      'hour',
    )
  }

  return new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' }).format(
    -Math.floor(elapsedHours / 24),
    'day',
  )
}
