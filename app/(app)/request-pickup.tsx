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
  Picker,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function RequestPickup() {
  const { user } = useAuth();
  const [wasteType, setWasteType] = useState('mixed');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');

      if (!address || !latitude || !longitude) {
        setError('Please fill in all required fields');
        return;
      }

      setLoading(true);

      if (!user) throw new Error('User not found');

      const { error: insertError } = await supabase.from('jobs').insert({
        requester_id: user.id,
        waste_type: wasteType,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        notes,
        status: 'pending',
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setWasteType('mixed');
      setAddress('');
      setLatitude('');
      setLongitude('');
      setNotes('');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request pickup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Pickup</Text>
          <Text style={styles.subtitle}>Schedule a waste collection</Text>
        </View>

        <View style={styles.form}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && (
            <Text style={styles.successText}>Pickup request submitted successfully!</Text>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Waste Type</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={wasteType}
                onValueChange={setWasteType}
                enabled={!loading}
              >
                <Picker.Item label="Mixed Waste" value="mixed" />
                <Picker.Item label="Recyclable" value="recyclable" />
                <Picker.Item label="Organic" value="organic" />
                <Picker.Item label="Hazardous" value="hazardous" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter pickup address"
              value={address}
              onChangeText={setAddress}
              editable={!loading}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0000"
                value={latitude}
                onChangeText={setLatitude}
                editable={!loading}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0000"
                value={longitude}
                onChangeText={setLongitude}
                editable={!loading}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any special instructions..."
              value={notes}
              onChangeText={setNotes}
              editable={!loading}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Request Pickup</Text>
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
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
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
    gap: 18,
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
    minHeight: 80,
    paddingTop: 12,
  },
  picker: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: 0,
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
  successText: {
    color: '#0B6B3A',
    fontSize: 14,
    backgroundColor: '#E8F5EC',
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
