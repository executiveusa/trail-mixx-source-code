import prisma from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@trailmixx.radio' },
    update: {},
    create: {
      email: 'demo@trailmixx.radio',
      passwordHash,
      displayName: 'Demo User',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create sample tracks
  const tracks = await Promise.all([
    prisma.track.upsert({
      where: { id: 'sample-1' },
      update: {},
      create: {
        id: 'sample-1',
        title: 'Seattle Nights',
        artistName: 'The Local Collective',
        status: 'APPROVED',
        tags: ['Seattle', 'R&B', 'Urban'],
        uploaderId: user.id,
        coverArtUrl: 'https://picsum.photos/seed/track1/400/400',
        duration: 245,
      },
    }),
    prisma.track.upsert({
      where: { id: 'sample-2' },
      update: {},
      create: {
        id: 'sample-2',
        title: 'Community Vibes',
        artistName: 'DJ Mixx',
        status: 'APPROVED',
        tags: ['Seattle', 'Hip-Hop', 'Community'],
        uploaderId: user.id,
        coverArtUrl: 'https://picsum.photos/seed/track2/400/400',
        duration: 198,
      },
    }),
    prisma.track.upsert({
      where: { id: 'sample-3' },
      update: {},
      create: {
        id: 'sample-3',
        title: 'Emerald City Flow',
        artistName: 'Somali Soul',
        status: 'APPROVED',
        tags: ['Seattle', 'Somali R&B', 'Fusion'],
        uploaderId: user.id,
        coverArtUrl: 'https://picsum.photos/seed/track3/400/400',
        duration: 213,
      },
    }),
    prisma.track.upsert({
      where: { id: 'sample-4' },
      update: {},
      create: {
        id: 'sample-4',
        title: 'Cover Session',
        artistName: 'Trail Mixx Collective',
        status: 'PENDING',
        tags: ['Cover', 'Live Session'],
        uploaderId: user.id,
        coverArtUrl: 'https://picsum.photos/seed/track4/400/400',
        duration: 189,
      },
    }),
  ]);

  console.log(`✅ Created ${tracks.length} sample tracks`);

  // Create play history
  for (const track of tracks.slice(0, 3)) {
    await prisma.playHistory.create({
      data: {
        trackId: track.id,
        source: 'RADIO',
        playedAt: new Date(Date.now() - Math.random() * 3600000),
      },
    });
  }

  console.log('✅ Created play history');

  // Create sample playlist
  const playlist = await prisma.playlist.upsert({
    where: { id: 'featured-playlist' },
    update: {},
    create: {
      id: 'featured-playlist',
      name: 'Seattle Community Favorites',
      description: 'Featured tracks from our Seattle community',
      isPublic: true,
      createdById: user.id,
      coverArtUrl: 'https://picsum.photos/seed/playlist1/600/600',
    },
  });

  // Add tracks to playlist
  for (let i = 0; i < tracks.length - 1; i++) {
    await prisma.playlistTrack.upsert({
      where: {
        playlistId_trackId: {
          playlistId: playlist.id,
          trackId: tracks[i].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist.id,
        trackId: tracks[i].id,
        position: i + 1,
      },
    });
  }

  console.log('✅ Created sample playlist');

  console.log('\n🎉 Seed complete!');
  console.log('\n📝 Demo credentials:');
  console.log('   Email: demo@trailmixx.radio');
  console.log('   Password: password123');
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
