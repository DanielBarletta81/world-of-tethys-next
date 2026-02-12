import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getMapImageSource, mapFragments } from '../../src/data/mapFragments';

export default function MapScreen() {
  const mapSource = getMapImageSource();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tethys Atlas</Text>
      <Text style={styles.subtitle}>Static reconnaissance stitched from field scans.</Text>

      <Image source={mapSource} style={styles.mapImage} resizeMode="cover" />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Regions</Text>
        {mapFragments.map((fragment) => (
          <View key={fragment.id} style={styles.regionRow}>
            <View>
              <Text style={styles.regionLabel}>{fragment.label}</Text>
              <Text style={styles.regionMeta}>{fragment.region}</Text>
            </View>
            <Text style={styles.regionBadge}>{fragment.id}</Text>
          </View>
        ))}
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
    padding: 20,
    paddingBottom: 80
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
  mapImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1a17'
  },
  section: {
    marginTop: 22,
    gap: 12
  },
  sectionTitle: {
    color: '#f97316',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  regionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f1a17',
    backgroundColor: '#151210'
  },
  regionLabel: {
    color: '#f4f4f5',
    fontSize: 15,
    fontWeight: '600'
  },
  regionMeta: {
    color: '#6b7280',
    fontSize: 11,
    letterSpacing: 1
  },
  regionBadge: {
    color: '#f97316',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  }
});
