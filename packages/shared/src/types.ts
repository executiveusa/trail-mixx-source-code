/**
 * Shared TypeScript types for Trail Mixx Radio
 * Used across web, mobile, and server
 */

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum TrackStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Track {
  id: string;
  title: string;
  artistName: string;
  uploaderId: string | null;
  uploader?: User;
  audioUrl: string | null;
  coverArtUrl: string | null;
  status: TrackStatus;
  tags: string[];
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlayHistory {
  id: string;
  trackId: string;
  track?: Track;
  playedAt: string;
  source: 'RADIO' | 'WEB' | 'MOBILE';
  listenerId: string | null;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  coverArtUrl: string | null;
  isPublic: boolean;
  createdById: string;
  createdBy?: User;
  tracks?: PlaylistTrack[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistTrack {
  id: string;
  playlistId: string;
  trackId: string;
  track?: Track;
  position: number;
  addedAt: string;
}

export interface NowPlaying {
  track: Track | null;
  startedAt: string | null;
  nextTrack: Track | null;
  recentlyPlayed: Track[];
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Track submission
export interface TrackSubmission {
  title: string;
  artistName: string;
  audioUrl?: string;
  coverArtUrl?: string;
  tags?: string[];
}
