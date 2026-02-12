import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0c0a09',
    borderTopColor: '#1f1a17',
    borderTopWidth: 1
  },
  tabLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#6b7280'
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="lore" options={{ title: 'Lore' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="audio" options={{ title: 'Audio' }} />
    </Tabs>
  );
}
