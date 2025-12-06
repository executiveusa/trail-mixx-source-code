import { RadioPlayer } from '@/components/RadioPlayer';
import { RecentlyPlayed } from '@/components/RecentlyPlayed';
import { FeaturedTracks } from '@/components/FeaturedTracks';

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-background pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent">
              TRAIL MIXX RADIO
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-12">
              Seattle's decentralized cover-song community station
            </p>

            {/* Radio Player */}
            <RadioPlayer />

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/discover"
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg transition-colors"
              >
                Discover Tracks
              </a>
              <a
                href="/about"
                className="px-8 py-4 bg-surface hover:bg-surface-light text-text-primary font-semibold rounded-lg transition-colors border border-primary/20"
              >
                Our Mission
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Played */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Recently Played</h2>
          <RecentlyPlayed />
        </div>
      </section>

      {/* Featured Community Tracks */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Community Covers</h2>
          <FeaturedTracks />
        </div>
      </section>

      {/* Mission Block */}
      <section className="py-24 bg-gradient-to-b from-background to-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Music for the <span className="text-primary">Community</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              Trail Mixx Radio is a Seattle-based social-purpose platform bringing together
              artists, creators, and music lovers. We celebrate diversity, community-driven
              content, and the power of cover songs to unite cultures.
            </p>
            <a
              href="/about"
              className="inline-block px-6 py-3 text-primary hover:text-primary-light transition-colors"
            >
              Learn more about our mission →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
