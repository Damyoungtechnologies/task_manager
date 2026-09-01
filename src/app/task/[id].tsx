import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { TaskFormModal } from '@/components/task-form-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatDate, isOverdue, priorityInfo, type Task, type TaskFormData } from '@/constants/task';
import { Spacing } from '@/constants/theme';
import { useTaskStore } from '@/store/taskStore';
import { confirmAction } from '@/utils/confirm';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tasks = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [editVisible, setEditVisible] = useState(false);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Task not found</ThemedText>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="linkPrimary">Go back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const priority = priorityInfo(task.priority);
  const overdue = isOverdue(task);

  const handleDelete = () => {
    confirmAction({
      title: 'Delete task?',
      message: `"${task.title}" will be removed.`,
      confirmLabel: 'Delete',
      onConfirm: () => {
        deleteTask(task.id);
        router.back();
      },
    });
  };

  const handleEditSubmit = (data: TaskFormData) => {
    updateTask(task.id, data);
    setEditVisible(false);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <ThemedText type="subtitle" style={styles.title}>{task.title}</ThemedText>
          <ThemedText
            type="smallBold"
            style={[styles.statusBadge, { backgroundColor: task.completed ? '#22c55e33' : '#f59e0b33' }]}
          >
            <ThemedText style={{ color: task.completed ? '#22c55e' : '#f59e0b' }}>
              {task.completed ? 'Completed' : 'Pending'}
            </ThemedText>
          </ThemedText>
        </View>

        <ThemedView type="backgroundElement" style={styles.card}>
          <DetailRow label="Priority">
            <ThemedText type="smallBold" style={{ color: priority.color }}>{priority.label}</ThemedText>
          </DetailRow>
          <DetailRow label="Category">
            <ThemedText type="small">{task.category || '—'}</ThemedText>
          </DetailRow>
          <DetailRow label="Due date">
            <ThemedText type="small" style={overdue ? { color: '#ef4444' } : undefined}>
              {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
            </ThemedText>
          </DetailRow>
          <DetailRow label="Status">
            <ThemedText type="small">{task.completed ? 'Completed' : 'Pending'}</ThemedText>
          </DetailRow>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">Description</ThemedText>
          <ThemedText>{task.description || 'No description provided.'}</ThemedText>
        </ThemedView>

        <View style={styles.actions}>
          <Pressable
            onPress={() => toggleTask(task.id)}
            style={[styles.button, { backgroundColor: task.completed ? '#f59e0b33' : '#22c55e33' }]}
          >
            <ThemedText type="smallBold" style={{ color: task.completed ? '#f59e0b' : '#22c55e' }}>
              {task.completed ? 'Mark as pending' : 'Mark as completed'}
            </ThemedText>
          </Pressable>
          <Pressable onPress={() => setEditVisible(true)} style={[styles.button, { backgroundColor: '#3c87f733' }]}>
            <ThemedText type="smallBold" style={{ color: '#3c87f7' }}>Edit task</ThemedText>
          </Pressable>
          <Pressable onPress={handleDelete} style={[styles.button, { backgroundColor: '#ef444433' }]}>
            <ThemedText type="smallBold" style={{ color: '#ef4444' }}>Delete task</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <TaskFormModal
        visible={editVisible}
        initialTask={task}
        onClose={() => setEditVisible(false)}
        onSubmit={handleEditSubmit}
      />
    </ThemedView>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>{label}</ThemedText>
      <View style={styles.detailValue}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex:  ​1 },
  centered: { flex:  ​1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  content: { padding: Spacing.four, gap: Spacing.three },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  title: { flex:  ​1 },
  statusBadge: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: Spacing.five },
  card: { gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.three },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two },
  detailLabel: { flexShrink:  ​0 },
  detailValue: { flexShrink:  ​1, alignItems: 'flex-end' },
  actions: { gap: Spacing.two },
  button: { alignItems: 'center', paddingVertical: Spacing.two, borderRadius: Spacing.three },
});