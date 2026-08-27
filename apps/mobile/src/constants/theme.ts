/**
 * Millennium brand palette, mirrored from apps/web/src/index.css.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#050914',
    textSecondary: '#64748b',
    background: '#f8fafc',
    backgroundElement: '#ffffff',
    backgroundSelected: '#f1f5f9',
    border: '#e2e8f0',
    primary: '#7c3aed',
    accent: '#6d28d9',
    cyan: '#0891b2',
    warning: '#db2777',
  },
  dark: {
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    background: '#050914',
    backgroundElement: '#10182a',
    backgroundSelected: '#28304a',
    border: '#28304a',
    primary: '#8b5cf6',
    accent: '#a78bfa',
    cyan: '#22d3ee',
    warning: '#ec4899',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  sans: 'SpaceGrotesk_400Regular',
  sansMedium: 'SpaceGrotesk_500Medium',
  sansBold: 'SpaceGrotesk_700Bold',
  display: 'PressStart2P_400Regular',
  mono: Platform.select({ ios: 'ui-monospace', android: 'monospace', web: 'monospace' }),
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 800;
