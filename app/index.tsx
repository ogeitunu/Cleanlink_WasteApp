import { useEffect } from "react";
import { router, useRootNavigationState } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const navState = useRootNavigationState();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!navState?.key) return;
    if (loading) return;

    if (!user) {
      router.replace("//login");
    } else {
      router.replace("//dashboard");
    }
  }, [navState, user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  );
}