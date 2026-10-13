import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3b82f6' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="keys"
        options={{
          title: 'Keys',
          tabBarIcon: ({ color, size }) => <Ionicons name="key" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="github"
        options={{
          title: 'GitHub',
          tabBarIcon: ({ color, size }) => <Ionicons name="logo-github" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}