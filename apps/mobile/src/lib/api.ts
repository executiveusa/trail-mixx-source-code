import Constants from 'expo-constants';
import type {
  NowPlaying,
  Track,
  Playlist,
  PaginatedResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  TrackSubmission,
} from '@trail-mixx/shared';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getNowPlaying(): Promise<NowPlaying | null> {
    const result = await this.request<NowPlaying>('/api/radio/now-playing');
    return result.data || null;
  }

  async getRecentPlays(limit = 20): Promise<Track[]> {
    const result = await this.request<Track[]>(`/api/radio/recent?limit=${limit}`);
    return result.data || [];
  }

  async getTracks(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    tags?: string;
    search?: string;
  }): Promise<PaginatedResponse<Track> | null> {
    const query = new URLSearchParams(params as any).toString();
    const result = await this.request<PaginatedResponse<Track>>(`/api/tracks?${query}`);
    return result.data || null;
  }

  async getTrack(id: string): Promise<Track | null> {
    const result = await this.request<Track>(`/api/tracks/${id}`);
    return result.data || null;
  }

  async createTrack(data: TrackSubmission, token: string): Promise<Track | null> {
    const result = await this.request<Track>('/api/tracks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return result.data || null;
  }

  async getPlaylists(): Promise<Playlist[]> {
    const result = await this.request<Playlist[]>('/api/playlists');
    return result.data || [];
  }

  async login(credentials: LoginRequest): Promise<AuthResponse | null> {
    const result = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return result.data || null;
  }

  async register(data: RegisterRequest): Promise<AuthResponse | null> {
    const result = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data || null;
  }
}

export const api = new ApiClient(API_URL);
