import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { CheckCircle, XCircle, User } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { colors, spacing } from '@/constants/assets';

interface Collector {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  nin: string | null;
  verified: boolean;
  created_at: string;
}

export default function CollectorsScreen() {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'collector')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setCollectors((data || []) as Collector[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching collectors:', err);
      setError('Failed to load collectors');
    } finally {
      setLoading(false);
    }
  };

  const approveCollector = async (collectorId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ verified: true })
        .eq('id', collectorId);

      if (updateError) throw updateError;

      setCollectors((prev) =>
        prev.map((c) => (c.id === collectorId ? { ...c, verified: true } : c))
      );

      Alert.alert('Success', 'Collector has been approved');
    } catch (err) {
      console.error('Error approving collector:', err);
      Alert.alert('Error', 'Failed to approve collector');
    }
  };

  const rejectCollector = async (collectorId: string) => {
    Alert.alert('Reject Collector', 'Are you sure? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error: deleteError } = await supabase
              .from('users')
              .delete()
              .eq('id', collectorId);

            if (deleteError) throw deleteError;

            setCollectors((prev) => prev.filter((c) => c.id !== collectorId));
            Alert.alert('Success', 'Collector has been rejected');
          } catch (err) {
            console.error('Error rejecting collector:', err);
            Alert.alert('Error', 'Failed to reject collector');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Collectors</Text>
        <View style={styles.spacer} />
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCollectors}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : collectors.length === 0 ? (
        <View style={styles.centerContainer}>
          <User size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>No collectors registered yet</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {collectors.map((collector) => (
            <View
              key={collector.id}
              style={[styles.collectorCard, collector.verified && styles.verifiedCard]}
            >
              <View style={styles.collectorInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{collector.full_name}</Text>
                  {collector.verified ? (
                    <View style={styles.verifiedBadge}>
                      <CheckCircle size={16} color={colors.success} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.email}>{collector.email}</Text>
                {collector.phone && <Text style={styles.phone}>{collector.phone}</Text>}
                <Text style={styles.nin}>NIN: {collector.nin || 'Not provided'}</Text>
                <Text style={styles.joinDate}>
                  Joined {new Date(collector.created_at).toLocaleDateString()}
                </Text>
              </View>

              {!collector.verified && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => approveCollector(collector.id)}
                  >
                    <CheckCircle size={20} color={colors.white} />
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => rejectCollector(collector.id)}
                  >
                    <XCircle size={20} color={colors.white} />
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  spacer: {
    width: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 14,
    marginTop: spacing.md,
  },
  collectorCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verifiedCard: {
    borderColor: colors.success,
    backgroundColor: '#F1F8F4',
  },
  collectorInfo: {
    marginBottom: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EC',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  verifiedText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  pendingText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '600',
  },
  email: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  phone: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  nin: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  joinDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  approveText: {
    color: colors.white,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  rejectText: {
    color: colors.white,
    fontWeight: '600',
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
