import { Link } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const ENTRY_POINTS = [
  { id: 'lore', title: 'Lore Archive', subtitle: 'Recovered entries and dossiers', href: '/(tabs)/lore' },
  { id: 'map', title: 'Tethys Atlas', subtitle: 'Static recon of the surface', href: '/(tabs)/map' },
  { id: 'audio', title: 'Echo Stone', subtitle: 'Ambient signals and fragments', href: '/(tabs)/audio' }
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>World of Tethys</Text>
      <Text style={styles.title}>The 111-MYA Archive</Text>
      <Text style={styles.body}>
        An atmospheric field companion for the Tethys archive. Read recovered lore, view
        the atlas, and listen to signal fragments carried in the ash.
      </Text>

      <View style={styles.cardStack}>
        {ENTRY_POINTS.map((entry) => (
          <Link key={entry.id} href={entry.href} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{entry.title}</Text>
              <Text style={styles.cardSubtitle}>{entry.subtitle}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09',
    paddingHorizontal: 24,
    paddingTop: 56
  },
  kicker: {
    color: '#a8a29e',
    letterSpacing: 3,
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 8
  },
  title: {
    color: '#f4f4f5',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16
  },
  body: {
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28
  },
  cardStack: {
    gap: 14
  },
  card: {
    borderWidth: 1,
    borderColor: '#1f1a17',
    backgroundColor: '#151210',
    padding: 18,
    borderRadius: 14
  },
  cardTitle: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6
  },
  cardSubtitle: {
    color: '#a8a29e',
    fontSize: 12,
    letterSpacing: 0.6
  }
});
