'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TrackCard } from './TrackCard';
import type { Track } from '@trail-mixx/shared';

export function FeaturedTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      const data = await api.getTracks({ pageSize: 8, status: 'APPROVED' });
      setTracks(data?.items || []);
      setLoading(false);
    };

    fetchTracks();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-surface-light rounded-xl h-64"></div>
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p>No featured tracks yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}
