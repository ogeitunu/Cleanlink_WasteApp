import { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors, spacing } from '@/constants/assets';

const WASTE_TYPES = [
  { label: 'Mixed Waste', value: 'mixed', price: 50 },
  { label: 'Recyclable', value: 'recyclable', price: 75 },
  { label: 'Organic', value: 'organic', price: 40 },
  { label: 'Hazardous', value: 'hazardous', price: 100 },
];

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
  const [locationLoading, setLocationLoading] = useState(false);

  const estimatedPrice = WASTE_TYPES.find((w) => w.value === wasteType)?.price || 50;

  const getCurrentLocation = async () => {
  try {
    setLocationLoading(true);
    setError('');

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setError('Location permission denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));

    const addresses = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (addresses.length > 0) {
      const addr = addresses[0];

      const formattedAddress = [
        addr.name,
        addr.street,
        addr.district,
        addr.city,
        addr.region,
        addr.country,
      ]
        .filter(Boolean)
        .join(', ');

      setAddress(formattedAddress);
    } else {
      // fallback if reverse geocode fails
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  } catch (err) {
    setError('Failed to get location. Please enter manually.');
  } finally {
    setLocationLoading(false);
  }
};

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
        estimated_price: estimatedPrice,
        request_source: 'app',
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

          {/* Pricing Card */}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceAmount}>₦{estimatedPrice.toLocaleString()}</Text>
            <Text style={styles.priceNote}>for {WASTE_TYPES.find((w) => w.value === wasteType)?.label || wasteType}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Waste Type</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={wasteType}
                onValueChange={setWasteType}
                enabled={!loading}
              >
                {WASTE_TYPES.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
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

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity
                style={[styles.locationButton, locationLoading && styles.buttonDisabled]}
                onPress={getCurrentLocation}
                disabled={locationLoading}
              >
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.locationButtonText}>
                  {locationLoading ? 'Getting location...' : 'Use Current Location'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0000"
                value={latitude}
                onChangeText={setLatitude}
                editable={!loading && !locationLoading}
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
                editable={!loading && !locationLoading}
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
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.textDark,
  },
  textArea: {
    minHeight: 80,
    paddingTop: spacing.md,
  },
  picker: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  priceCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  priceNote: {
    fontSize: 12,
    color: colors.primary,
    marginTop: spacing.xs,
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    gap: 0,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
  },
  successText: {
    color: colors.primary,
    fontSize: 14,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  locationButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
