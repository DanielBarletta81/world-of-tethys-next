import { Link } from 'expo-router';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { loreEntries } from '../../src/data/loreEntries';

export default function LoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lore Archive</Text>
      <Text style={styles.subtitle}>Recovered entries from the deep stacks.</Text>

      <FlatList
        data={loreEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/lore/${item.id}`} asChild>
            <Pressable style={styles.card}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              ) : (
                <View style={styles.cardImageFallback}>
                  <Text style={styles.cardImageFallbackText}>{item.title.slice(0, 1)}</Text>
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardKicker}>{item.category}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardExcerpt}>{item.excerpt}</Text>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardMeta}>{item.threatLevel}</Text>
                  <Text style={styles.cardMeta}>Kith {item.kithRequirement}</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
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
  list: {
    paddingBottom: 80,
    gap: 16
  },
  card: {
    borderWidth: 1,
    borderColor: '#1f1a17',
    backgroundColor: '#151210',
    borderRadius: 16,
    overflow: 'hidden'
  },
  cardImage: {
    height: 140,
    width: '100%'
  },
  cardImageFallback: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1917'
  },
  cardImageFallbackText: {
    color: '#f97316',
    fontSize: 32,
    fontWeight: '700'
  },
  cardContent: {
    padding: 16,
    gap: 6
  },
  cardKicker: {
    color: '#f97316',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  cardTitle: {
    color: '#f4f4f5',
    fontSize: 18,
    fontWeight: '600'
  },
  cardExcerpt: {
    color: '#a8a29e',
    fontSize: 13,
    lineHeight: 18
  },
  cardMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardMeta: {
    color: '#6b7280',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});
