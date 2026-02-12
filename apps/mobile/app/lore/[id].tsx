import { Link, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { loreEntries } from '../../src/data/loreEntries';

export default function LoreDetailScreen() {
  const { id } = useLocalSearchParams();
  const entry = loreEntries.find((item) => item.id === id);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Entry Missing</Text>
        <Text style={styles.body}>This archive entry could not be found.</Text>
        <Link href="/(tabs)/lore" style={styles.link}>Return to Lore</Link>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Link href="/(tabs)/lore" style={styles.link}>Back to Lore</Link>
      <Text style={styles.kicker}>{entry.category}</Text>
      <Text style={styles.title}>{entry.title}</Text>
      {entry.imageUrl ? (
        <Image source={{ uri: entry.imageUrl }} style={styles.heroImage} />
      ) : (
        <View style={styles.heroFallback}>
          <Text style={styles.heroFallbackText}>{entry.title.slice(0, 1)}</Text>
        </View>
      )}
      <Text style={styles.body}>{entry.excerpt}</Text>
      <View style={styles.metaRow}>
        <View>
          <Text style={styles.metaLabel}>Threat Level</Text>
          <Text style={styles.metaValue}>{entry.threatLevel}</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>Kith Required</Text>
          <Text style={styles.metaValue}>{entry.kithRequirement}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09'
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 80,
    gap: 16
  },
  link: {
    color: '#f97316',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  kicker: {
    color: '#a8a29e',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  title: {
    color: '#f4f4f5',
    fontSize: 30,
    fontWeight: '700'
  },
  heroImage: {
    height: 220,
    width: '100%',
    borderRadius: 16
  },
  heroFallback: {
    height: 220,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1917'
  },
  heroFallbackText: {
    color: '#f97316',
    fontSize: 40,
    fontWeight: '700'
  },
  body: {
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 22
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#151210',
    borderWidth: 1,
    borderColor: '#1f1a17'
  },
  metaLabel: {
    color: '#6b7280',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  metaValue: {
    color: '#f4f4f5',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600'
  }
});
