import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterBar } from '@/components/filter-bar';
import { TaskFormModal } from '@/components/task-form-modal';
import { TaskItem } from '@/components/task-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type Filter, type Task, type TaskFormData } from '@/constants/task';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTaskStore } from '@/store/taskStore';
import { confirmAction } from '@/utils/confirm';

export default function TasksScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const tasks = useTaskStore((state) => state.tasks);
  const stats = useTaskStore((state) => state.stats);
  const addTask = useTaskStore((state) => state.addTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  // Local/UI state — managed with useState
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'pending' && !task.completed) ||
        filter === task.priority;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const handleAddSubmit = (data: TaskFormData) => {
    addTask(data);
    setModalVisible(false);
  };

  const handleDelete = (task: Task) => {
    confirmAction({
      title: 'Delete task?',
      message: `"${task.title}" will be removed.`,
      confirmLabel: 'Delete',
      onConfirm: () => deleteTask(task.id),
    });
  };

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Task }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => handleDelete(item)}
            onPress={() => router.push(`/task/${item.id}`)}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
              <ThemedText type="subtitle">My Tasks</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {stats.pending} pending and {stats.completed} completed
              </ThemedText>
            </View>

            <View style={styles.statsRow}>
              <StatCard label="Total" value={stats.total} color={theme.text} />
              <StatCard label="Pending" value={stats.pending} color="#f59e0b" />
              <StatCard label="Completed" value={stats.completed} color="#22c55e" />
            </View>

            <View style={styles.searchWrap}>
              <TextInput
                style={[styles.searchInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                placeholder="Search tasks..."
                placeholderTextColor={theme.textSecondary}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
              />
            </View>

            <FilterBar filter={filter} onChange={setFilter} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText type="smallBold" themeColor="textSecondary">No tasks found</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              Try changing the search or filter, or add a new task.
            </ThemedText>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.six },
        ]}
      />

      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.fab, { backgroundColor: '#3c87f7', bottom: insets.bottom + BottomTabInset + Spacing.four }]}
      >
        <ThemedText style={styles.fabIcon}>+</ThemedText>
      </Pressable>

      <TaskFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddSubmit}
      />
    </ThemedView>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.statCard}>
      <ThemedText type="subtitle" style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { gap: Spacing.one, paddingHorizontal: Spacing.four, paddingBottom: Spacing.three },
  statsRow: { flexDirection: 'row', gap: Spacing.two, paddingHorizontal: Spacing.four, marginBottom: Spacing.three },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Spacing.three },
  statValue: { fontSize: 28, lineHeight: 34 },
  searchWrap: { paddingHorizontal: Spacing.four, marginBottom: Spacing.two },
  searchInput: { borderRadius: Spacing.three, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, fontSize: 16 },
  listContent: { flexGrow: 1, paddingTop: Spacing.two },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.six, gap: Spacing.one },
  emptyHint: { textAlign: 'center', paddingHorizontal: Spacing.four },
  fab: { position: 'absolute', right: Spacing.four, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  fabIcon: { color: '#ffffff', fontSize: 28, lineHeight: 32 },
});