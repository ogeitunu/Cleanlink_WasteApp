import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LogOut, Wallet, Award } from 'lucide-react-native';

interface Stats {
  totalEarnings: number;
  totalPoints: number;
  completedJobs: number;
}

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalEarnings: 0,
    totalPoints: 0,
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      if (!user) return;

      const [earningsData, pointsData, jobsData] = await Promise.all([
        supabase
          .from('payments')
          .select('amount')
          .eq('collector_id', user.id)
          .eq('status', 'paid'),
        supabase
          .from('rewards')
          .select('points')
          .eq('user_id', user.id)
          .eq('type', 'earned'),
        supabase
          .from('jobs')
          .select('id')
          .eq('collector_id', user.id)
          .eq('status', 'completed'),
      ]);

      const totalEarnings =
        earningsData.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const totalPoints =
        pointsData.data?.reduce((sum, r) => sum + (r.points || 0), 0) || 0;
      const completedJobs = jobsData.data?.length || 0;

      setStats({
        totalEarnings,
        totalPoints,
        completedJobs,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/auth/welcome');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0B6B3A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {user?.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified Collector</Text>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Wallet size={32} color="#F47B20" strokeWidth={1.5} />
          <Text style={styles.statValue}>{stats.totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <Award size={32} color="#0B6B3A" strokeWidth={1.5} />
          <Text style={styles.statValue}>{stats.totalPoints}</Text>
          <Text style={styles.statLabel}>Reward Points</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValueLarge}>{stats.completedJobs}</Text>
          <Text style={styles.statLabel}>Jobs Completed</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>NIN</Text>
          <Text style={styles.infoValue}>{user?.nin || 'Not provided'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Not set'}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : 'Unknown'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FFFFFF" strokeWidth={1.5} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0B6B3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  verifiedBadge: {
    backgroundColor: '#E8F5EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B6B3A',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B6B3A',
  },
  statValueLarge: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B6B3A',
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B6B3A',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5EC',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  spacing: {
    height: 20,
  },
});
