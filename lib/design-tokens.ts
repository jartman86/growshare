/**
 * Design Tokens for GrowShare
 *
 * Centralized design system tokens for colors, spacing, typography, and more.
 * Use these throughout the app for consistent styling.
 */

export const colors = {
  // Primary - Green (Growing, Nature, Community)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a', // Main brand color
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Secondary - Blue (Trust, Technology)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Accent Colors for Different Features
  accents: {
    // Tools/Equipment - Orange
    tools: {
      light: '#fed7aa',
      DEFAULT: '#ea580c',
      dark: '#c2410c',
    },
    // Resources/Education - Emerald
    resources: {
      light: '#a7f3d0',
      DEFAULT: '#059669',
      dark: '#047857',
    },
    // Community - Purple
    community: {
      light: '#e9d5ff',
      DEFAULT: '#9333ea',
      dark: '#7e22ce',
    },
    // Marketplace - Amber
    marketplace: {
      light: '#fde68a',
      DEFAULT: '#f59e0b',
      dark: '#d97706',
    },
  },

  // Status Colors
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Neutral Grays
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
}

export const spacing = {
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
}

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
}

export const typography = {
  fontFamily: {
    sans: 'var(--font-inter)',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem' }], // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
}

/**
 * Gradient Presets for Hero Sections
 */
export const gradients = {
  primary: 'from-green-600 to-blue-600',
  dashboard: 'from-green-600 to-blue-600',
  tools: 'from-orange-600 to-amber-600',
  resources: 'from-emerald-600 to-green-600',
  community: 'from-purple-600 to-indigo-600',
  marketplace: 'from-amber-600 to-orange-600',
  hero: 'from-green-50 via-white to-blue-50',
}

/**
 * Helper function to get accent color by feature
 */
export function getAccentColor(feature: keyof typeof colors.accents) {
  return colors.accents[feature]?.DEFAULT || colors.primary[600]
}

/**
 * Helper function to get gradient by feature
 */
export function getGradient(feature: keyof typeof gradients) {
  return gradients[feature] || gradients.primary
}
