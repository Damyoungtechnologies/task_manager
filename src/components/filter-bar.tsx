import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FILTERS, type Filter } from '@/constants/task';
import { Spacing } from '@/constants/theme';

interface FilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((option) => {
        const selected = option.value === filter;
        return (
          <Pressable key={option.value} onPress={() => onChange(option.value)}>
            <ThemedView
              type={selected ? 'backgroundSelected' : 'backgroundElement'}
              style={styles.chip}
            >
              <ThemedText type="smallBold" themeColor={selected ? 'text' : 'textSecondary'}>
                {option.label}
              </ThemedText>
            </ThemedView>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  chip: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
});