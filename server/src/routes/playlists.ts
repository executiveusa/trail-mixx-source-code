import { Router } from 'express';
import prisma from '../db';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all playlists
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const where: any = {};

    // Only show public playlists to non-authenticated users
    if (!req.userId) {
      where.isPublic = true;
    }

    const playlists = await prisma.playlist.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        tracks: {
          include: {
            track: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: playlists });
  } catch (error) {
    next(error);
  }
});

// Get single playlist
router.get('/:id', async (req, res, next) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        tracks: {
          include: {
            track: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    res.json({ success: true, data: playlist });
  } catch (error) {
    next(error);
  }
});

// Create playlist (authenticated)
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { name, description, coverArtUrl, isPublic = true } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name required' });
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        coverArtUrl,
        isPublic,
        createdById: req.userId!,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: playlist });
  } catch (error) {
    next(error);
  }
});

// Add track to playlist
router.post('/:id/tracks', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ success: false, error: 'trackId required' });
    }

    // Check playlist exists and user owns it
    const playlist = await prisma.playlist.findUnique({
      where: { id: req.params.id },
      include: { tracks: true },
    });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    if (playlist.createdById !== req.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // Get next position
    const maxPosition = playlist.tracks.length > 0
      ? Math.max(...playlist.tracks.map((t) => t.position))
      : 0;

    const playlistTrack = await prisma.playlistTrack.create({
      data: {
        playlistId: req.params.id,
        trackId,
        position: maxPosition + 1,
      },
      include: {
        track: true,
      },
    });

    res.status(201).json({ success: true, data: playlistTrack });
  } catch (error) {
    next(error);
  }
});

export default router;
