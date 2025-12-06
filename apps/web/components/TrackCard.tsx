import Image from 'next/image';
import type { Track } from '@trail-mixx/shared';

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <div className="group bg-surface hover:bg-surface-light border border-primary/10 rounded-xl overflow-hidden transition-all hover:border-primary/30 hover:scale-105">
      {/* Cover Art */}
      <div className="relative aspect-square bg-background overflow-hidden">
        {track.coverArtUrl ? (
          <Image
            src={track.coverArtUrl}
            alt={track.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent-magenta/20">
            <svg
              className="w-16 h-16 text-primary/40"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-1 line-clamp-1">{track.title}</h3>
        <p className="text-sm text-text-secondary mb-3 line-clamp-1">{track.artistName}</p>

        {/* Tags */}
        {track.tags && track.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {track.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
