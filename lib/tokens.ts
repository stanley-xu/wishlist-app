// Design Tokens - Clean, functional design system

export const colors = {
  // Brand colors
  primary: 'hsl(135, 100%, 80%)',
  primaryDark: 'hsl(135, 100%, 30%)',
  primaryContrast: 'hsl(135, 100%, 15%)', // Dark green for text on pastel backgrounds
  
  // Neutral colors (light theme)
  background: 'hsl(135, 100%, 100%)',
  surface: 'hsl(135, 40%, 97%)',
  border: 'hsl(135, 20%, 85%)',
  
  // Text colors (maintaining accessibility)
  text: 'hsl(135, 15%, 15%)',          // Dark green-tinted text (AA compliant)
  textSecondary: 'hsl(135, 10%, 45%)', // Medium green-gray
  textPlaceholder: 'hsl(135, 5%, 60%)', // Light green-gray
  
  // Status colors (pastel theme)
  success: 'hsl(135, 60%, 70%)',       // Soft success green
  error: 'hsl(0, 70%, 75%)',           // Soft error pink
  warning: 'hsl(35, 80%, 75%)',        // Soft warning peach

  // Utility
  white: 'hsl(0, 0, 100%)'
} as const

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const

// Backward compatibility - keep default export for now
const TOKENS = {
  colors,
  typography,
  spacing,
  borderRadius,
}

export default TOKENS
