'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TrackCard } from '@/components/TrackCard';
import type { Track } from '@trail-mixx/shared';

export default function DiscoverPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = ['Seattle', 'R&B', 'Hip-Hop', 'Urban', 'Community', 'Somali R&B', 'Cover', 'Live Session', 'Fusion'];

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      const data = await api.getTracks({
        pageSize: 50,
        search: search || undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
      });
      setTracks(data?.items || []);
      setLoading(false);
    };

    const debounce = setTimeout(fetchTracks, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover</h1>
          <p className="text-lg text-text-secondary">
            Explore community-curated tracks from Seattle and beyond
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search tracks or artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-surface border border-primary/20 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-background'
                    : 'bg-surface text-text-secondary hover:bg-surface-light'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-surface rounded-xl h-80"></div>
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-text-secondary">
              No tracks found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-text-muted">
              Found {tracks.length} track{tracks.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
