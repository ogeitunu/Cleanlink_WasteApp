import { Tabs } from 'expo-router';
import { Briefcase, MapPin, User, Bell } from 'lucide-react-native';
import * as Linking from 'expo-linking';

const linking = {
  prefixes: [Linking.createURL('')], // Adjust the prefix as needed
};

export default function AppLayout() {
  // SAFE fallback (NO hooks in layout)
  const unreadCount = 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0B6B3A',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 8,
          height: 64,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => (
            <Briefcase size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Bell size={size} color={color} strokeWidth={1.5} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />

      <Tabs.Screen
        name="request-pickup"
        options={{
          title: 'Request',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />

    </Tabs>
  );
}