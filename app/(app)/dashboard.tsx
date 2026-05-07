import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SectionList,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react-native';

interface Job {
  id: string;
  waste_type: string;
  address: string | null;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  requester_id: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<{ title: string; data: Job[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchJobs();

    const subscription = supabase
      .channel('jobs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const fetchJobs = async () => {
    try {
      if (!user) return;

      const queries = [
        supabase
          .from('jobs')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('jobs')
          .select('*')
          .eq('collector_id', user.id)
          .eq('status', 'accepted')
          .order('created_at', { ascending: false }),
        supabase
          .from('jobs')
          .select('*')
          .eq('collector_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false }),
      ];

      const [pendingData, activeData, completedData] = await Promise.all(
        queries.map((q) => q)
      );

      const sections = [];

      if (pendingData.data && pendingData.data.length > 0) {
        sections.push({
          title: 'Available Jobs',
          data: pendingData.data as Job[],
        });
      }

      if (activeData.data && activeData.data.length > 0) {
        sections.push({
          title: 'Active Jobs',
          data: activeData.data as Job[],
        });
      }

      if (completedData.data && completedData.data.length > 0) {
        sections.push({
          title: 'Completed Jobs',
          data: completedData.data as Job[],
        });
      }

      setJobs(sections);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ collector_id: user.id, status: 'accepted' })
        .eq('id', jobId);

      if (error) throw error;
      fetchJobs();
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    if (!user) return;
    try {
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', jobId);

      if (updateError) throw updateError;

      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobData) {
        const amount = jobData.waste_type === 'recyclable' ? 50 : 30;

        const { error: paymentError } = await supabase.from('payments').insert({
          job_id: jobId,
          collector_id: user.id,
          amount,
          status: 'pending',
        });

        if (paymentError) throw paymentError;

        if (jobData.waste_type === 'recyclable') {
          await supabase.from('rewards').insert({
            user_id: user.id,
            points: 10,
            type: 'earned',
            job_id: jobId,
          });
        }
      }

      fetchJobs();
    } catch (error) {
      console.error('Error completing job:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F47B20';
      case 'accepted':
        return '#FF9800';
      case 'completed':
        return '#0B6B3A';
      default:
        return '#999999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle size={20} color="#F47B20" strokeWidth={1.5} />;
      case 'accepted':
        return <Clock size={20} color="#FF9800" strokeWidth={1.5} />;
      case 'completed':
        return <CheckCircle2 size={20} color="#0B6B3A" strokeWidth={1.5} />;
      default:
        return null;
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
    <SectionList
      sections={jobs.length > 0 ? jobs : [{ title: 'No Jobs Available', data: [] }]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.jobCard}>
          <View style={styles.cardHeader}>
            <View style={styles.statusBadge}>
              {getStatusIcon(item.status)}
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.wasteType}>{item.waste_type}</Text>
            <Text style={styles.address}>{item.address || 'Address not provided'}</Text>
          </View>

          <View style={styles.cardFooter}>
            {item.status === 'pending' && (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptJob(item.id)}
              >
                <Text style={styles.acceptButtonText}>Accept Job</Text>
              </TouchableOpacity>
            )}

            {item.status === 'accepted' && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleCompleteJob(item.id)}
              >
                <Text style={styles.completeButtonText}>Complete Job</Text>
              </TouchableOpacity>
            )}

            {item.status === 'completed' && (
              <Text style={styles.completedText}>Completed</Text>
            )}
          </View>
        </View>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      scrollEnabled={true}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          fetchJobs();
        }} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B6B3A',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    gap: 8,
    marginBottom: 12,
  },
  wasteType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  address: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: '#0B6B3A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#F47B20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  completedText: {
    color: '#0B6B3A',
    fontSize: 13,
    fontWeight: '600',
  },
});
