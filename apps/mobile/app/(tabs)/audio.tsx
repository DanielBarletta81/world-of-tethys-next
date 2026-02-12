import { Pressable, StyleSheet, Text, View } from 'react-native';
import { audioTracks } from '../../src/data/audioTracks';
import { useAudio } from '../../src/providers/AudioProvider';

const formatTime = (millis: number) => {
  if (!millis || Number.isNaN(millis)) return '0:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function AudioScreen() {
  const {
    activeTrack,
    isPlaying,
    status,
    positionMillis,
    durationMillis,
    toggle,
    seek
  } = useAudio();

  const progress = durationMillis ? Math.min(1, positionMillis / durationMillis) : 0;
  const canPlay = status !== 'error';
  const missingCdn = audioTracks.some((track) => !track.src);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Echo Stone</Text>
      <Text style={styles.subtitle}>Ambient signals, recovered transmissions.</Text>
      {missingCdn && (
        <Text style={styles.warning}>
          Set EXPO_PUBLIC_CDN_BASE in apps/mobile/.env to enable audio streaming.
        </Text>
      )}

      <View style={styles.nowPlayingCard}>
        <Text style={styles.sectionTitle}>Now Playing</Text>
        {activeTrack ? (
          <>
            <Text style={styles.trackTitle}>{activeTrack.title}</Text>
            <Text style={styles.trackArtist}>{activeTrack.artist}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.progressText}>{formatTime(positionMillis)}</Text>
              <Text style={styles.progressText}>{formatTime(durationMillis)}</Text>
            </View>
            <View style={styles.controls}>
              <Pressable
                style={[styles.controlButton, styles.controlSecondary]}
                onPress={() => seek(Math.max(0, positionMillis - 10000))}
              >
                <Text style={styles.controlText}>-10s</Text>
              </Pressable>
              <Pressable
                style={[styles.controlButton, !canPlay && styles.controlDisabled]}
                onPress={() => toggle()}
                disabled={!canPlay}
              >
                <Text style={styles.controlText}>{isPlaying ? 'Pause' : 'Play'}</Text>
              </Pressable>
              <Pressable
                style={[styles.controlButton, styles.controlSecondary]}
                onPress={() => seek(Math.min(durationMillis || 0, positionMillis + 10000))}
              >
                <Text style={styles.controlText}>+10s</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Select a signal from the archive below.</Text>
        )}
      </View>

      <View style={styles.list}>
        {audioTracks.map((track) => {
          const isActive = activeTrack?.id === track.id;
          return (
            <Pressable key={track.id} style={styles.trackRow} onPress={() => toggle(track)}>
              <View>
                <Text style={[styles.trackRowTitle, isActive && styles.trackRowTitleActive]}>
                  {track.title}
                </Text>
                <Text style={styles.trackRowMeta}>{track.type}</Text>
              </View>
              <Text style={styles.trackRowAction}>{isActive && isPlaying ? 'Pause' : 'Play'}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09',
    paddingHorizontal: 20,
    paddingTop: 32
  },
  title: {
    color: '#f4f4f5',
    fontSize: 28,
    fontWeight: '700'
  },
  subtitle: {
    color: '#a8a29e',
    marginTop: 6,
    marginBottom: 18
  },
  warning: {
    color: '#f97316',
    fontSize: 12,
    marginBottom: 12
  },
  nowPlayingCard: {
    backgroundColor: '#151210',
    borderWidth: 1,
    borderColor: '#1f1a17',
    borderRadius: 16,
    padding: 16,
    gap: 8
  },
  sectionTitle: {
    color: '#f97316',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  trackTitle: {
    color: '#f4f4f5',
    fontSize: 18,
    fontWeight: '600'
  },
  trackArtist: {
    color: '#a8a29e',
    fontSize: 13
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 13
  },
  progressBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#1f1a17',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316'
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  progressText: {
    color: '#6b7280',
    fontSize: 11
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#f97316',
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center'
  },
  controlSecondary: {
    backgroundColor: '#1f1a17'
  },
  controlDisabled: {
    opacity: 0.5
  },
  controlText: {
    color: '#f4f4f5',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  list: {
    marginTop: 18,
    gap: 12,
    paddingBottom: 80
  },
  trackRow: {
    backgroundColor: '#151210',
    borderWidth: 1,
    borderColor: '#1f1a17',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  trackRowTitle: {
    color: '#f4f4f5',
    fontSize: 14,
    fontWeight: '600'
  },
  trackRowTitleActive: {
    color: '#f97316'
  },
  trackRowMeta: {
    color: '#6b7280',
    fontSize: 11,
    letterSpacing: 1
  },
  trackRowAction: {
    color: '#f97316',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});
