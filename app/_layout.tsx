import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    let isMounted = true;

    const prepare = async () => {
      try {
        // keep splash for minimum time (optional UX delay)
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        console.warn('Splash preparation error:', error);
      } finally {
        if (isMounted) {
          await SplashScreen.hideAsync();
        }
      }
    };

    prepare();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}