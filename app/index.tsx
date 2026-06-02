import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Home() {
  const router = useRouter();
  const { session, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // No session → go to auth
    if (!session || !user) {
      router.replace('/auth/welcome');
      return;
    }

    // Safe role handling
    const role = user?.role;

    if (role === 'collector') {
      router.replace('/dashboard');
    } else if (role === 'resident') {
      router.replace('/request-pickup');
    } else {
      router.replace('/admin');
    }
  }, [loading, session, user, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0B6B3A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});