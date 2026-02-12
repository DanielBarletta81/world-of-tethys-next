import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioProvider } from '../src/providers/AudioProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </AudioProvider>
    </SafeAreaProvider>
  );
}
