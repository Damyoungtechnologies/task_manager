import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatDate, isOverdue, priorityInfo, type Task } from '@/constants/task';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

export function TaskItem({ task, onToggle, onDelete, onPress }: TaskItemProps) {
  const theme = useTheme();
  const priority = priorityInfo(task.priority);
  const overdue = isOverdue(task);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <Pressable
          hitSlop={10}
          onPress={onToggle}
          style={[
            styles.checkbox,
            task.completed && { backgroundColor: priority.color, borderColor: priority.color },
          ]}
        >
          {task.completed && <ThemedText style={styles.checkmark}>✓</ThemedText>}
        </Pressable>

        <View style={styles.content}>
          <ThemedText
            type={task.completed ? 'default' : 'smallBold'}
            numberOfLines={1}
            style={[styles.title, task.completed && styles.completedTitle]}
          >
            {task.title}
          </ThemedText>

          {task.description.length > 0 && (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={2} style={styles.description}>
              {task.description}
            </ThemedText>
          )}

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: priority.color + '26' }]}>
              <ThemedText type="small" style={[styles.badgeText, { color: priority.color }]}>
                {priority.label}
              </ThemedText>
            </View>
            {task.category.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.badgeText}>
                  {task.category}
                </ThemedText>
              </View>
            )}
            <ThemedText
              type="small"
              themeColor={overdue ? 'text' : 'textSecondary'}
              style={[styles.dueDate, overdue && { color: '#ef4444' }]}
            >
              {overdue ? '⚠ ' : ''}
              {formatDate(task.dueDate)}
            </ThemedText>
          </View>
        </View>

        <Pressable hitSlop={10} onPress={onDelete} style={styles.deleteButton}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.deleteIcon}>
            ✕
          </ThemedText>
        </Pressable>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  checkbox: {
    width: 28,
    height:  28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#B0B4BA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontSize: 16,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#60646C',
  },
  description: {
    marginTop: -Spacing.half,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.three,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
  },
  dueDate: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 'auto',
  },
  deleteButton: {
    padding: Spacing.two,
    alignSelf: 'flex-start',
  },
  deleteIcon: {
    fontSize: 14,
    lineHeight: 18,
  },
});