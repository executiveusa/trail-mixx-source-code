import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Get now playing
router.get('/now-playing', async (req, res, next) => {
  try {
    // Get most recent play
    const currentPlay = await prisma.playHistory.findFirst({
      where: { source: 'RADIO' },
      orderBy: { playedAt: 'desc' },
      include: {
        track: true,
      },
    });

    // Get recently played (last 10)
    const recentPlays = await prisma.playHistory.findMany({
      where: { source: 'RADIO' },
      orderBy: { playedAt: 'desc' },
      take: 10,
      include: {
        track: true,
      },
    });

    // Get next track (for now, just get a random approved track)
    const nextTrack = await prisma.track.findFirst({
      where: {
        status: 'APPROVED',
        NOT: {
          id: currentPlay?.trackId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: {
        track: currentPlay?.track || null,
        startedAt: currentPlay?.playedAt || null,
        nextTrack: nextTrack || null,
        recentlyPlayed: recentPlays.map((p) => p.track),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get recent plays
router.get('/recent', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const plays = await prisma.playHistory.findMany({
      where: { source: 'RADIO' },
      orderBy: { playedAt: 'desc' },
      take: limit,
      include: {
        track: true,
      },
    });

    res.json({
      success: true,
      data: plays.map((p) => ({
        ...p.track,
        playedAt: p.playedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Log a play (internal use for AutoDJ or streaming server)
router.post('/log-play', async (req, res, next) => {
  try {
    const { trackId, source = 'RADIO' } = req.body;

    if (!trackId) {
      return res.status(400).json({ success: false, error: 'trackId required' });
    }

    const play = await prisma.playHistory.create({
      data: {
        trackId,
        source,
      },
      include: {
        track: true,
      },
    });

    res.json({ success: true, data: play });
  } catch (error) {
    next(error);
  }
});

export default router;
