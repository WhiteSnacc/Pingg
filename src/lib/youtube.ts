export function getYouTubeEmbedUrl(urlValue: string): string | null {
  try {
    const url = new URL(urlValue)
    const host = url.hostname.toLowerCase()
    let videoId: string | null = null

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (host === 'youtube.com' || host === 'www.youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v')
      } else {
        const pathParts = url.pathname.split('/').filter(Boolean)
        if (
          (pathParts[0] === 'embed' || pathParts[0] === 'shorts') &&
          pathParts.length > 1
        ) {
          videoId = pathParts[1]
        }
      }
    }

    return videoId && /^[\w-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : null
  } catch {
    return null
  }
}
