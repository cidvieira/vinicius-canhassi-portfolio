/**
 * Extracts the video ID and returns the embed URL for YouTube and Vimeo.
 * 
 * Supported formats:
 * - YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
 * - Vimeo: vimeo.com/ID
 * 
 * @param url The original video URL
 * @returns The embed URL or the original URL if no ID is found
 */
export function getEmbedUrl(url: string): string {
  if (!url) return '';

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null;

  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&modestbranding=1&rel=0&iv_load_policy=3`;
  }

  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&title=0&byline=0&portrait=0`;
  }

  return url;
}

/**
 * Checks if a URL points directly to a video file.
 */
export function isDirectVideoFile(url: string): string | null {
  const match = url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);
  return match ? match[0] : null;
}

/**
 * Checks if a URL is likely a vertical YouTube Shorts or mobile video.
 */
export function isVerticalVideo(url: string): boolean {
  return url.includes('/shorts/') || url.includes('shorts/');
}
