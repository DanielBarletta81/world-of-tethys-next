import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signal Lost</Text>
      <Text style={styles.body}>The path you followed does not exist in this archive.</Text>
      <Link href="/(tabs)" style={styles.link}>Return Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12
  },
  title: {
    color: '#f4f4f5',
    fontSize: 24,
    fontWeight: '700'
  },
  body: {
    color: '#a8a29e',
    textAlign: 'center'
  },
  link: {
    color: '#f97316',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});
