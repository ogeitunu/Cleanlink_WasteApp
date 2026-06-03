import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [loading, setLoading] = useState(false);

   useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      console.log('No active reset session');
    }
  };

  checkSession();
}, []);

  const handleUpdate = async () => {
  if (!password || !confirm) {
    Alert.alert('Error', 'Fill all fields');
    return;
  }

  if (password !== confirm) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;

    Alert.alert('Success', 'Password updated successfully');

    await supabase.auth.signOut();

    router.replace('/auth/login');
  } catch (err: any) {
    Alert.alert('Error', err.message);
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

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

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Password</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#0B6B3A',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});