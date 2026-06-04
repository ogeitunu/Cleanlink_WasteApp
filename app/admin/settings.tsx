import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/constants/assets';

export default function AdminSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>

      <TouchableOpacity style={styles.item}>
        <Text>System Configuration</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text>Manage Roles</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text>Notification Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logout}
        onPress={() => router.replace('//login')}
      >
        <Text style={{ color: 'red' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.white },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  logout: {
    marginTop: 30,
    padding: 15,
  },
});