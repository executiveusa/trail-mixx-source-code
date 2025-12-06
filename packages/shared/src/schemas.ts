/**
 * Zod validation schemas
 * Shared between client and server for consistent validation
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
});

export const trackSubmissionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artistName: z.string().min(1, 'Artist name is required'),
  audioUrl: z.string().url('Invalid audio URL').optional(),
  coverArtUrl: z.string().url('Invalid cover art URL').optional(),
  tags: z.array(z.string()).optional(),
});

export const trackUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  artistName: z.string().min(1).optional(),
  audioUrl: z.string().url().optional().nullable(),
  coverArtUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});
