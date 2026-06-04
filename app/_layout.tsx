import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    let isMounted = true;

    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
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
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}