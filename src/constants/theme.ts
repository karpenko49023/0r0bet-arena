/**
 * Preset DARK_PREMIUM — only the two accent colours are overridden for the
 * Orobet identity (primary #6C5CE7 -> #17E08C, secondary #A29BFE -> #FFB020).
 * Every other preset value is kept. Rule #11b: `name` stays DARK_PREMIUM.
 */

export const theme = {
  name: 'DARK_PREMIUM',

  colors: {
    bg: {
      primary: '#111114',
      secondary: '#18181C',
      tertiary: '#1F1F24',
      accent: '#252530',
      deep: '#09090C',
    },
    accent: {
      primary: '#17E08C',
      secondary: '#FFB020',
      warm: '#FD79A8',
      cool: '#74B9FF',
      success: '#55EFC4',
      danger: '#FF5A6E',
    },
    text: {
      primary: '#F5F6F8',
      secondary: '#A0A3AE',
      accent: '#17E08C',
      muted: '#6B6E79',
    },
    ui: {
      border: 'rgba(255,255,255,0.07)',
      borderActive: 'rgba(23,224,140,0.28)',
      divider: 'rgba(255,255,255,0.08)',
      overlay: 'rgba(9,9,12,0.94)',
      glass: 'rgba(24,24,28,0.9)',
    },
  },

  gradients: {
    primary: ['#17E08C', '#0FB873'] as const,
    secondary: ['#17E08C', '#FFB020'] as const,
    surface: ['#18181C', '#1F1F24'] as const,
    loader: ['rgba(5,5,6,0.93)', 'rgba(17,17,20,0.97)', '#09090C'] as const,
    menu: [
      'rgba(17,17,20,0.72)',
      'rgba(17,17,20,0.88)',
      'rgba(9,9,12,0.96)',
    ] as const,
    game: ['rgba(17,17,20,0.86)', 'rgba(9,9,12,0.95)'] as const,
    result: ['rgba(9,9,12,0.80)', 'rgba(17,17,20,0.94)'] as const,
    hub: ['rgba(17,17,20,0.90)', 'rgba(9,9,12,0.96)'] as const,
  },

  typography: {
    hero: { fontSize: 42, fontWeight: '800' as const, letterSpacing: -0.5 },
    loaderTitle: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 3 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 0.4 },
    verdict: { fontSize: 30, fontWeight: '800' as const, letterSpacing: 1 },
    section: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 1.2 },
    body: { fontSize: 15, fontWeight: '500' as const, lineHeight: 21 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.4 },
    button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 1.2 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  radius: { sm: 10, md: 14, lg: 18, xl: 20, xxl: 28, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 6,
    },
    cta: {
      shadowColor: '#17E08C',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 8,
    },
  },

  animation: {
    spring: { tension: 48, friction: 8 },
    press: { tension: 300, friction: 12 },
    bounce: { tension: 60, friction: 7 },
    smooth: { duration: 260 },
    screen: { duration: 240 },
  },
};

export type Theme = typeof theme;

export const C = theme.colors;
