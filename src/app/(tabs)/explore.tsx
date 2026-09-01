import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, PRIORITIES } from '@/constants/task';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTaskStore } from '@/store/taskStore';
import { confirmAction } from '@/utils/confirm';

export default function StatsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const tasks = useTaskStore((state) => state.tasks);
  const stats = useTaskStore((state) => state.stats);
  const clearCompleted = useTaskStore((state) => state.clearCompleted);

  const completionPercent = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  const priorityBreakdown = useMemo(() => {
    return PRIORITIES.map((p) => {
      const group = tasks.filter((t) => t.priority === p.value);
      const done = group.filter((t) => t.completed).length;
      return { ...p, total: group.length, completed: done };
    });
  }, [tasks]);

  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.filter((c) => tasks.some((t) => t.category === c)).map((c) => {
      const group = tasks.filter((t) => t.category === c);
      return { category: c, total: group.length, completed: group.filter((t) => t.completed).length };
    });
  }, [tasks]);

  const handleClearCompleted = () => {
    confirmAction({
      title: 'Clear completed tasks?',
      message: 'This will permanently remove every completed task.',
      confirmLabel: 'Clear',
      onConfirm: () => clearCompleted(),
    });
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
          },
        ]}
      >
        <ThemedText type="subtitle">Statistics</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          An overview of your task progress
        </ThemedText>

        <View style={styles.statGrid}>
          <BigStat label="Total tasks" value={stats.total} color={theme.text} />
          <BigStat label="Pending" value={stats.pending} color="#f59e0b" />
          <BigStat label="Completed" value={stats.completed} color="#22c55e" />
          <BigStat label="Completion" value={`${completionPercent}%`} color="#3c87f7" />
        </View>

        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold">By priority</ThemedText>
          {priorityBreakdown.map((item) => (
            <View key={item.value} style={styles.breakGroup}>
              <View style={styles.breakRow}>
                <ThemedText type="small" style={{ color: item.color }}>{item.label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{item.completed}/{item.total}</ThemedText>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
                <View style={{ height: '100%', width: `${item.total === 0 ? 0 : (item.completed / item.total) * 100}%`, backgroundColor: item.color }} />
              </View>
            </View>
          ))}
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold">By category</ThemedText>
          {categoryBreakdown.map((item) => (
            <View key={item.category} style={styles.breakRow}>
              <ThemedText type="small">{item.category}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{item.completed}/{item.total} completed</ThemedText>
            </View>
          ))}
          {categoryBreakdown.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">No tasks yet - add some tasks to see category stats.</ThemedText>
          )}
        </ThemedView>

        <Pressable
          onPress={handleClearCompleted}
          disabled={stats.completed === 0}
          style={[styles.clearButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ThemedText type="smallBold" style={{ color: stats.completed === 0 ? theme.textSecondary : '#ef4444' }}>
            Clear completed tasks
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

function BigStat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.bigStat}>
      <ThemedText type="subtitle" style={[styles.bigStatValue, { color }]}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex:  ​1 },
  content: { paddingHorizontal: Spacing.four, gap: Spacing.three },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.two },
  bigStat: { flexBasis: '46%', flexGrow:  ​1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Spacing.three },
  bigStatValue: { fontSize:  ​32, lineHeight:  ​​36 },
  bigStatLabel: { fontSize:  ​12, lineHeight:  ​16 },
  section: { gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.three },
  breakGroup: { gap: Spacing.one },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  progressTrack: { height:  ​6, borderRadius: ​3, overflow: 'hidden' },
  clearButton: { alignItems: 'center', paddingVertical: Spacing.two, borderRadius: Spacing.three },
});