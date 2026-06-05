import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  // =========================
  // MANUAL FALLBACK RECOVERY
  // =========================
  const recoverSessionManually = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      setIsRecovery(true);
      return;
    }

    const { data: user } = await supabase.auth.getUser();

    if (user?.user) {
      setIsRecovery(true);
    }
  };

  // =========================
  // SESSION DETECTION (ROBUST)
  // =========================
  useEffect(() => {
    let isMounted = true;

    let subscription: any;

    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (isMounted && data.session) {
        setIsRecovery(true);
      }
    };

    init();
    recoverSessionManually();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        if (event === "PASSWORD_RECOVERY" || session) {
          setIsRecovery(true);
        }
      }
    );

    subscription = authListener.subscription;

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // =========================
  // UPDATE PASSWORD
  // =========================
  const handleUpdate = async () => {
    if (!password || !confirm) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      Alert.alert("Success", "Password updated successfully");

      await supabase.auth.signOut();

      router.replace("/(auth)/login");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {!isRecovery && (
        <Text style={styles.warning}>
          If you opened this manually, use the email link OR continue if session is detected.
        </Text>
      )}

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />

      <Pressable
        onPress={handleUpdate}
        disabled={loading}
        style={[styles.button, loading && { opacity: 0.6 }]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update Password"}
        </Text>
      </Pressable>
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0B6B3A",
  },
  warning: {
    color: "#D32F2F",
    marginBottom: 15,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#0B6B3A",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});