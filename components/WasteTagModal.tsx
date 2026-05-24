import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { colors, spacing } from '@/constants/assets';

const WASTE_TAGS = ['Mixed', 'Recyclable', 'Organic', 'Hazardous', 'E-Waste', 'Metal', 'Plastic'];

interface WasteTagModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tags: string[]) => Promise<void>;
  jobId: string;
}

export default function WasteTagModal({ visible, onClose, onSubmit, jobId }: WasteTagModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      setError('Please select at least one waste type');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedTags);
      setSelectedTags([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save waste tags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Trash2 size={24} color={colors.primary} />
            </View>
            <Text style={styles.title}>Tag Waste Type</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Select the waste types collected in this job</Text>

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Tags Grid */}
          <ScrollView style={styles.tagsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.tagsGrid}>
              {WASTE_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    selectedTags.includes(tag) && styles.tagButtonSelected,
                  ]}
                  onPress={() => toggleTag(tag)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedLabel}>Selected ({selectedTags.length}):</Text>
              <View style={styles.selectedTags}>
                {selectedTags.map((tag) => (
                  <View key={tag} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Complete Job</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    fontSize: 24,
    color: colors.textLight,
    width: 40,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  tagsContainer: {
    maxHeight: 300,
    marginBottom: spacing.lg,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  tagButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  tagButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: colors.white,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  selectedContainer: {
    marginBottom: spacing.lg,
  },
  selectedLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectedTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedTagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
