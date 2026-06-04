import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors, spacing } from '@/constants/assets';

const mockUsers = [
  { id: '1', name: 'John Doe', role: 'User' },
  { id: '2', name: 'Jane Smith', role: 'Collector' },
];

export default function UsersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>

      <FlatList
        data={mockUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.white },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 16, fontWeight: '600' },
  role: { fontSize: 13, color: colors.textLight },
});