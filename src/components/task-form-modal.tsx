import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, PRIORITIES, type Priority, type Task, type TaskFormData } from '@/constants/task';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface TaskFormModalProps {
  visible: boolean;
  initialTask?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}

export function TaskFormModal({ visible, initialTask, onClose, onSubmit }: TaskFormModalProps) {
  const theme = useTheme();
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? 'medium');
  const [category, setCategory] = useState(initialTask?.category ?? CATEGORIES[0]);
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setTitle(initialTask?.title ?? '');
      setDescription(initialTask?.description ?? '');
      setPriority(initialTask?.priority ?? 'medium');
      setCategory(initialTask?.category ?? CATEGORIES[0]);
      setDueDate(initialTask?.dueDate ?? '');
      setError(null);
    }
  }, [visible, initialTask]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a task title.');
      return;
    }
    if (dueDate.trim().length > 0 && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) {
      setError('Use the YYYY-MM-DD date format.');
      return;
    }
    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate.trim(),
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory(CATEGORIES[0]);
    setDueDate('');
    setError(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <ThemedView style={styles.overlay}>
        <ThemedView type="backgroundElement" style={styles.modalCard}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </ThemedText>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            <Field label="Title">
              <TextInput
                style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (error) setError(null);
                }}
                placeholder="e.g. Finish the assignment"
                placeholderTextColor={theme.textSecondary}
              />
            </Field>

            <Field label="Description">
              <TextInput
                style={[styles.input, styles.textArea, { borderColor: theme.backgroundSelected, color: theme.text }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Optional details..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
              />
            </Field>

            <Field label="Priority">
              <View style={styles.priorityRow}>
                {PRIORITIES.map((p) => (
                  <Pressable key={p.value} onPress={() => setPriority(p.value)} style={[styles.priorityChip, { backgroundColor: priority === p.value ? p.color + '33' : theme.backgroundSelected }]}>
                    <ThemedText type="smallBold" style={{ color: priority === p.value ? p.color : theme.textSecondary }}>
                      {p.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </Field>

            <Field label="Category">
              <View style={styles.categoryWrap}>
                {CATEGORIES.map((c) => (
                  <Pressable key={c} onPress={() => setCategory(c)} style={[styles.categoryChip, { backgroundColor: category === c ? '#3c87f733' : theme.backgroundSelected }]}>
                    <ThemedText type="small" style={{ color: category === c ? '#3c87f7' : theme.textSecondary }}>
                      {c}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </Field>

            <Field label="Due date (YYYY-MM-DD)">
              <TextInput
                style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                value={dueDate}
                onChangeText={(text) => {
                  setDueDate(text);
                  if (error) setError(null);
                }}
                placeholder="e.g. 2026-09-30"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="none"
              />
            </Field>

            {error && (
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
            )}

            <View style={styles.actions}>
              <Pressable onPress={handleClose} style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="smallBold" themeColor="textSecondary">Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={handleSubmit} style={[styles.button, { backgroundColor: '#3c87f7' }]}>
                <ThemedText type="smallBold" style={styles.submitLabel}>
                  {isEditing ? 'Save Changes' : 'Add Task'}
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold" themeColor="textSecondary">{label}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex:  1,
    backgroundColor: 'rgba(0,  0,  0,  0.5)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    borderRadius: Spacing.five,
    padding: Spacing.four,
    maxHeight: '85%',
  },
  modalTitle: {
    marginBottom: Spacing.three,
  },
  form: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth:  1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  textArea: {
    minHeight:  100,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  priorityChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one +  2,
    borderRadius: Spacing.five,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  categoryChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  error: {
    color: '#ef4444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  submitLabel: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});