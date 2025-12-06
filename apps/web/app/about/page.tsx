export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent">
            Our Mission
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Trail Mixx Radio is Seattle's decentralized cover-song community radio station,
            built for and by diverse creators and music lovers.
          </p>
        </div>

        {/* Mission Sections */}
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Section 1 */}
          <section>
            <div className="bg-surface border border-primary/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4 text-primary">Community-Driven</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                We believe music is the universal language that brings people together.
                Trail Mixx Radio is a platform where Seattle's diverse communities—from
                emerging artists to established creators—can share their unique interpretations
                of beloved songs through cover versions and remixes.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="bg-surface border border-primary/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4 text-accent-magenta">
                Social Purpose
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-4">
                As a social-purpose organization, we're committed to:
              </p>
              <ul className="space-y-3 text-lg text-text-secondary">
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>
                    Amplifying underrepresented voices in Seattle's music scene
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>
                    Supporting local artists through fair compensation and exposure
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>
                    Creating inclusive spaces for cross-cultural musical collaboration
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>
                    Building technology that empowers, not exploits, creators
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="bg-surface border border-primary/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4 text-accent-purple">
                Seattle Studio
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-4">
                Our flagship initiative, the Seattle Studio, is a physical and virtual space
                where artists can:
              </p>
              <ul className="space-y-3 text-lg text-text-secondary mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Record high-quality cover songs and original interpretations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Collaborate with other local musicians and producers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Access mentorship and technical resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Share their work with a global audience via our platform</span>
                </li>
              </ul>
              <p className="text-lg text-text-secondary leading-relaxed">
                We focus particularly on supporting Seattle's Somali-American community
                and other underrepresented groups in creating fusion R&B and urban music
                that celebrates their heritage while pushing creative boundaries.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Whether you're an artist, listener, or supporter, there's a place for you
              at Trail Mixx Radio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@trailmixx.radio"
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg transition-colors"
              >
                Get in Touch
              </a>
              <a
                href="/"
                className="px-8 py-4 bg-surface hover:bg-surface-light text-text-primary font-semibold rounded-lg transition-colors border border-primary/20"
              >
                Listen Now
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
