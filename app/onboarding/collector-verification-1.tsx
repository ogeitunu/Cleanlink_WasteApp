import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import * as Location from 'expo-location';

export default function CollectorVerification1() {
  const router = useRouter();
  const { user } = useAuth();

  const [nin, setNin] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setAddress(`${location.coords.latitude}, ${location.coords.longitude}`);
    } catch (error) {
      setError('Failed to get current location');
    }
  };

  const handleContinue = async () => {
    try {
      setError('');

      if (!nin.trim() || !address.trim()) {
        setError('Please fill in all fields');
        return;
      }

      setLoading(true);

      if (!user) throw new Error('User not found');

      const { error: updateError } = await supabase
  .from('collector_profiles')
  .upsert({
    user_id: user.id,
    nin,
    address,
    verified: false,
    verification_step: 1,
  });

      if (updateError) throw updateError;

      router.push('/onboarding/collector-verification-2');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save information'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Text style={styles.title}>Collector Verification</Text>
          <Text style={styles.subtitle}>
            Provide your identification details
          </Text>
        </View>

        <View style={styles.form}>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Enter NIN"
            value={nin}
            onChangeText={setNin}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <TouchableOpacity
            style={styles.button}
            onPress={getCurrentLocation}
          >
            <Text style={styles.buttonText}>
              Use Current Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 30,
  },
  stepBadge: {
    backgroundColor: '#E8F5EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B6B3A',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B6B3A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#0B6B3A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
