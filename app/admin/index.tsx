import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Users, Briefcase, BarChart3 } from 'lucide-react-native';
import { colors, spacing } from '@/constants/assets';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>Manage CleanLinka operations</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('//collectors')}
        >
          <View style={styles.cardIcon}>
            <Users size={32} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Manage Collectors</Text>
            <Text style={styles.cardDescription}>Approve or reject collector registrations</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <Briefcase size={32} color={colors.accent} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Job Assignments</Text>
            <Text style={styles.cardDescription}>Assign jobs to collectors</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <BarChart3 size={32} color={colors.success} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Analytics</Text>
            <Text style={styles.cardDescription}>View system analytics and reports</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Web Dashboard Available</Text>
          <Text style={styles.infoText}>
            Access the full admin dashboard at the web URL for comprehensive management
            features including real-time metrics, detailed analytics, and advanced
            configuration options.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  infoCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
  },
});
