/**
 * Utility functions for hospital web app
 */

export function getWhatsAppLink(phone: string | undefined | null, name: string): string {
  // Clean phone number: remove non-digits
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const message = encodeURIComponent(`Hello Chairman ${name}, I am contacting you from the Dhading Hospital Website regarding hospital services.`);
  return `https://wa.me/${cleanPhone || '9779851012345'}?text=${message}`;
}

export function parseVideoEmbed(url: string): string {
  if (!url) return '';
  
  // YouTube link parser
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  
  // Generic return
  return url;
}

export function getYouTubeThumbnail(url: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/0.jpg`;
    }
  }
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
}
