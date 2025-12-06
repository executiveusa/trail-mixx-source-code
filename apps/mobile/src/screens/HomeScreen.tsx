import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { api } from '../lib/api';
import { colors, spacing } from '../theme/colors';
import type { NowPlaying, Track } from '@trail-mixx/shared';

const STREAM_URL = Constants.expoConfig?.extra?.streamUrl || 'http://localhost:8000/stream';

export function HomeScreen() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadData = async () => {
    const [nowPlayingData, recentData] = await Promise.all([
      api.getNowPlaying(),
      api.getRecentPlays(5),
    ]);
    setNowPlaying(nowPlayingData);
    setRecentTracks(recentData);
    setLoading(false);
  };

  const togglePlay = async () => {
    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      } else {
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: STREAM_URL },
            { shouldPlay: true }
          );
          setSound(newSound);
          setIsPlaying(true);
        } catch (error) {
          console.error('Failed to load stream:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.title}>TRAIL MIXX RADIO</Text>
        <Text style={styles.subtitle}>Seattle Community Radio</Text>
      </View>

      {/* Player */}
      <View style={styles.player}>
        <View style={styles.nowPlayingInfo}>
          <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
          {nowPlaying?.track ? (
            <>
              <Text style={styles.trackTitle}>{nowPlaying.track.title}</Text>
              <Text style={styles.artistName}>{nowPlaying.track.artistName}</Text>
            </>
          ) : (
            <Text style={styles.trackTitle}>Trail Mixx Radio</Text>
          )}
        </View>

        <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color={colors.background}
          />
        </TouchableOpacity>

        {nowPlaying?.nextTrack && (
          <Text style={styles.nextUp}>
            Next up: {nowPlaying.nextTrack.title} - {nowPlaying.nextTrack.artistName}
          </Text>
        )}
      </View>

      {/* Recently Played */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        {recentTracks.map((track) => (
          <View key={track.id} style={styles.trackCard}>
            <View style={styles.trackInfo}>
              <Text style={styles.trackCardTitle}>{track.title}</Text>
              <Text style={styles.trackCardArtist}>{track.artistName}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  player: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nowPlayingInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nowPlayingLabel: {
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  artistName: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  nextUp: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  trackCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trackInfo: {
    flex: 1,
  },
  trackCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  trackCardArtist: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
