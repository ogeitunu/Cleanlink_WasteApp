import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Home() {
  const router = useRouter();
  const { session, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (session && user) {
        if (user.role === 'collector') {
          router.replace('/dashboard')
        } else if (user.role === 'resident') {
          router.replace('/request-pickup');
        } else {
          router.replace('/admin');
        }
      } else {
        router.replace('/auth/welcome');
      }
    }
  }, [loading, session, user]);

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
