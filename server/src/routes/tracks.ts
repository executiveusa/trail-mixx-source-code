import { Router } from 'express';
import prisma from '../db';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import { trackSubmissionSchema, trackUpdateSchema } from '@trail-mixx/shared';

const router = Router();

// Get all tracks (with filters)
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const status = req.query.status as string;
    const tags = req.query.tags as string;
    const search = req.query.search as string;

    const where: any = {};

    // Only show approved tracks to non-authenticated users
    if (!req.userId) {
      where.status = 'APPROVED';
    } else if (status) {
      where.status = status;
    }

    if (tags) {
      where.tags = { hasSome: tags.split(',') };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { artistName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tracks, total] = await Promise.all([
      prisma.track.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              email: true,
              displayName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.track.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: tracks,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single track
router.get('/:id', async (req, res, next) => {
  try {
    const track = await prisma.track.findUnique({
      where: { id: req.params.id },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            displayName: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!track) {
      return res.status(404).json({ success: false, error: 'Track not found' });
    }

    res.json({ success: true, data: track });
  } catch (error) {
    next(error);
  }
});

// Create track (authenticated)
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const data = trackSubmissionSchema.parse(req.body);

    const track = await prisma.track.create({
      data: {
        ...data,
        uploaderId: req.userId,
        tags: data.tags || [],
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            displayName: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: track });
  } catch (error) {
    next(error);
  }
});

// Update track (authenticated, own tracks only or admin)
router.patch('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const data = trackUpdateSchema.parse(req.body);

    // Check ownership (for now, anyone authenticated can update)
    // TODO: Add admin check for status changes
    const existing = await prisma.track.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Track not found' });
    }

    const track = await prisma.track.update({
      where: { id: req.params.id },
      data,
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            displayName: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.json({ success: true, data: track });
  } catch (error) {
    next(error);
  }
});

// Delete track (authenticated, own tracks only or admin)
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.track.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Track not found' });
    }

    // TODO: Check ownership or admin status

    await prisma.track.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: 'Track deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
