import { useQuery } from '@tanstack/react-query';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { fetchHealth } from '@/lib/api';

export default function HomeScreen() {
  const theme = useTheme();
  const health = useQuery({ queryKey: ['health'], queryFn: fetchHealth });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
          <ThemedText type="display" themeColor="primary">
            MILLENIUM
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Mobile-grund: Expo + TanStack Query
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Backend:{' '}
            {health.isLoading && 'kollar...'}
            {health.isError && <ThemedText type="smallBold" themeColor="warning">offline</ThemedText>}
            {health.data && <ThemedText type="smallBold" themeColor="cyan">{health.data.status}</ThemedText>}
          </ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
            ]}>
            <ThemedText type="smallBold" style={{ color: '#f8fafc' }}>
              Kom igång
            </ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  subtitle: {
    marginTop: -Spacing.two,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});
