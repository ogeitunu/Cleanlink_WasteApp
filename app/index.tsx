import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { session, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!session || !user) {
      router.replace('/auth/welcome');
      return;
    }

    // Go into TAB GROUP (IMPORTANT FIX)
    router.replace('/(app)/dashboard');
  }, [loading, session, user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}