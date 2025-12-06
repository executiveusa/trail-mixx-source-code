'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import type { NowPlaying } from '@trail-mixx/shared';

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const streamUrl = process.env.NEXT_PUBLIC_STREAM_URL || 'http://localhost:8000/stream';

  useEffect(() => {
    // Fetch now playing data
    const fetchNowPlaying = async () => {
      const data = await api.getNowPlaying();
      setNowPlaying(data);
      setLoading(false);
    };

    fetchNowPlaying();

    // Poll every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(streamUrl);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Failed to play stream:', error);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-surface border border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto">
      {/* Now Playing Info */}
      <div className="text-center mb-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-surface-light rounded w-32 mx-auto mb-2"></div>
            <div className="h-6 bg-surface-light rounded w-48 mx-auto"></div>
          </div>
        ) : nowPlaying?.track ? (
          <>
            <p className="text-sm text-text-muted uppercase tracking-wide mb-2">Now Playing</p>
            <h3 className="text-2xl font-bold text-text-primary mb-1">
              {nowPlaying.track.title}
            </h3>
            <p className="text-lg text-text-secondary">{nowPlaying.track.artistName}</p>
          </>
        ) : (
          <>
            <p className="text-sm text-text-muted uppercase tracking-wide mb-2">Trail Mixx Radio</p>
            <h3 className="text-2xl font-bold text-text-primary">Seattle Community Radio</h3>
          </>
        )}
      </div>

      {/* Play Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={togglePlay}
          className="w-20 h-20 rounded-full bg-primary hover:bg-primary-dark transition-all flex items-center justify-center text-background hover:scale-105 active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Next Up */}
      {nowPlaying?.nextTrack && (
        <div className="text-center text-sm text-text-muted">
          <span className="uppercase tracking-wide">Next up:</span>{' '}
          <span className="text-text-secondary">
            {nowPlaying.nextTrack.title} - {nowPlaying.nextTrack.artistName}
          </span>
        </div>
      )}
    </div>
  );
}
