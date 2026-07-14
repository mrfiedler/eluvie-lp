import { useState } from 'react';
import { Play } from 'lucide-react';

interface Props {
  videoId: string;
  title?: string;
  className?: string;
  params?: string; // extra query params for embed
  thumbnailQuality?: 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault';
}

/**
 * Lightweight YouTube facade: renders a static thumbnail with a play button.
 * The real YouTube iframe (and its ~1MB of third-party JS/cookies) is only
 * injected after the user clicks play.
 */
const YouTubeFacade = ({
  videoId,
  title = 'YouTube video',
  className = '',
  params = 'autoplay=1&rel=0',
  thumbnailQuality = 'hqdefault',
}: Props) => {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <iframe
        className={`w-full h-full ${className}`}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  const thumb = `https://i.ytimg.com/vi/${videoId}/${thumbnailQuality}.jpg`;

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`Play video: ${title}`}
      className={`relative w-full h-full block group ${className}`}
    >
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        width={480}
        height={360}
        className="w-full h-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <span className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-magenta/90 shadow-lg group-hover:scale-105 transition-transform">
          <Play className="h-8 w-8 text-white fill-white" />
        </span>
      </span>
    </button>
  );
};

export default YouTubeFacade;