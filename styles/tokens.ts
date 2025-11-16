export const palette = {
  // https://coolors.co/386641-6a994e-a7c957-f2e8cf-bc4749
  primary1: "hsla(132, 29%, 31%, 1)",
  primary1Darkened: "hsla(132, 29%, 20%, 1)",
  primary2: "hsla(98, 32%, 45%, 1)",
  primary3: "hsla(78, 51%, 56%, 1)",
  beige: "hsla(43, 57%, 88%, 1)",
  secondary: "hsla(359, 47%, 51%, 1)",
  white: "hsla(0, 0%, 95%, 1.00)",
} as const;

export const colours = {
  // Neutral colors (light theme)
  background: palette.white,
  surface: palette.primary1,
  accent: palette.primary3,

  // Status colors (pastel theme)
  success: "hsl(135, 60%, 70%)", // Soft success green
  error: "hsl(0, 70%, 75%)", // Soft error pink
  warning: "hsl(35, 80%, 75%)", // Soft warning peach
} as const;

export const text = {
  black: "hsl(135, 15%, 15%)",
  white: palette.white,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Backward compatibility - keep default export for now
const TOKENS = {
  palette,
  colours,
  typography,
  spacing,
  borderRadius,
};

export default TOKENS;
