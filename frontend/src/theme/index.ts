/**
 * Custom theme configuration for Climate Data Explorer
 * Tesla-inspired theme with dark/light mode support
 */
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Brand colors
        brand: {
          50: { value: '#e6fffa' },
          100: { value: '#b2f5ea' },
          200: { value: '#81e6d9' },
          300: { value: '#4fd1c5' },
          400: { value: '#38b2ac' },
          500: { value: '#319795' },
          600: { value: '#2c7a7b' },
          700: { value: '#285e61' },
          800: { value: '#234e52' },
          900: { value: '#1d4044' },
        },
        // Accent colors
        accent: {
          // Dark mode variants (high contrast on dark backgrounds)
          cyan: { value: '#06b6d4' },
          cyanGlow: { value: 'rgba(6, 182, 212, 0.15)' },
          orange: { value: '#f59e0b' },
          orangeGlow: { value: 'rgba(245, 158, 11, 0.15)' },
          purple: { value: '#8b5cf6' },
          purpleGlow: { value: 'rgba(139, 92, 246, 0.15)' },
          emerald: { value: '#10b981' },
          emeraldGlow: { value: 'rgba(16, 185, 129, 0.15)' },
          // Light mode variants (WCAG AA compliant - 4.5:1 contrast on light bg)
          cyanLight: { value: '#0891b2' },      // Darker cyan for light mode (5.1:1)
          orangeLight: { value: '#b45309' },    // Darker orange for light mode (5.4:1)
          purpleLight: { value: '#7c3aed' },    // Darker purple for light mode
          emeraldLight: { value: '#059669' },   // Darker emerald for light mode
        },
      },
      fonts: {
        heading: { value: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
        body: { value: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
        mono: { value: '"SF Mono", "JetBrains Mono", "Fira Code", monospace' },
      },
      radii: {
        card: { value: '12px' },
        button: { value: '8px' },
      },
      shadows: {
        glow: { value: '0 0 20px rgba(6, 182, 212, 0.3)' },
        card: { value: '0 4px 24px rgba(0, 0, 0, 0.4)' },
        cardHover: { value: '0 8px 32px rgba(0, 0, 0, 0.5)' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)

// Theme color tokens for dark and light modes
export const themeColors = {
  dark: {
    bg: '#0a0a0f',
    bgSecondary: '#111118',
    card: 'rgba(255, 255, 255, 0.03)',
    cardHover: 'rgba(255, 255, 255, 0.06)',
    cardSolid: '#18181b',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.15)',
    borderActive: 'rgba(6, 182, 212, 0.4)',
    text: '#e4e4e7',
    textSecondary: '#a1a1aa',
    textMuted: '#7e7e87',  // WCAG AA compliant (4.91:1 contrast)
    headerBg: 'rgba(10, 10, 15, 0.95)',
    inputBg: 'rgba(255, 255, 255, 0.03)',
    buttonBg: 'rgba(255, 255, 255, 0.05)',
    buttonHover: 'rgba(255, 255, 255, 0.08)',
    selectedBg: 'rgba(6, 182, 212, 0.15)',
    selectedBorder: 'rgba(6, 182, 212, 0.4)',
    // Chart specific
    chartGrid: 'rgba(255, 255, 255, 0.05)',
    chartLine: 'rgba(255, 255, 255, 0.1)',
    chartHoverBg: 'rgba(24, 24, 27, 0.95)',
    // Accessible accent colors (WCAG AA compliant)
    accentCyan: '#22d3ee',      // cyan-400 - 8.14:1 contrast
    accentOrange: '#fbbf24',    // amber-400 - 9.20:1 contrast
    accentPurple: '#a78bfa',    // violet-400
    accentCyanText: '#06b6d4',  // For text on dark bg
    accentOrangeText: '#f59e0b',
    accentCyanGlow: 'rgba(6, 182, 212, 0.15)',
    accentPurpleGlow: 'rgba(139, 92, 246, 0.15)',
  },
  light: {
    bg: '#f8fafc',
    bgSecondary: '#ffffff',
    card: 'rgba(255, 255, 255, 0.8)',
    cardHover: 'rgba(255, 255, 255, 0.95)',
    cardSolid: '#ffffff',
    border: 'rgba(0, 0, 0, 0.1)',
    borderHover: 'rgba(0, 0, 0, 0.2)',
    borderActive: 'rgba(8, 145, 178, 0.6)',
    text: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    inputBg: 'rgba(0, 0, 0, 0.03)',
    buttonBg: 'rgba(0, 0, 0, 0.05)',
    buttonHover: 'rgba(0, 0, 0, 0.08)',
    selectedBg: 'rgba(8, 145, 178, 0.1)',
    selectedBorder: 'rgba(8, 145, 178, 0.5)',
    // Chart specific
    chartGrid: 'rgba(0, 0, 0, 0.06)',
    chartLine: 'rgba(0, 0, 0, 0.1)',
    chartHoverBg: 'rgba(255, 255, 255, 0.98)',
    // Accessible accent colors (WCAG AA compliant - 4.5:1+ contrast)
    accentCyan: '#0891b2',      // cyan-600 - 5.1:1 contrast on light bg
    accentOrange: '#b45309',    // amber-700 - 5.4:1 contrast on light bg
    accentPurple: '#7c3aed',    // violet-600
    accentCyanText: '#0e7490',  // cyan-700 for text - 6.3:1 contrast
    accentOrangeText: '#92400e', // amber-800 for text - 7.1:1 contrast
    accentCyanGlow: 'rgba(8, 145, 178, 0.15)',
    accentPurpleGlow: 'rgba(124, 58, 237, 0.15)',
  },
} as const

export type ColorMode = 'dark' | 'light'

// Get chart theme based on color mode
export const getChartTheme = (mode: ColorMode) => {
  const colors = themeColors[mode]
  return {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      family: 'Inter, system-ui, sans-serif',
      color: colors.textSecondary,
      size: 12,
    },
    xaxis: {
      gridcolor: colors.chartGrid,
      linecolor: colors.chartLine,
      tickfont: { size: 11, color: colors.textMuted },
      title: { font: { size: 12, color: colors.textSecondary } },
    },
    yaxis: {
      gridcolor: colors.chartGrid,
      linecolor: colors.chartLine,
      tickfont: { size: 11, color: colors.textMuted },
      title: { font: { size: 12, color: colors.textSecondary } },
      zeroline: true,
      zerolinecolor: colors.chartLine,
    },
    legend: {
      font: { size: 11, color: colors.textSecondary },
      bgcolor: 'transparent',
    },
    hoverlabel: {
      bgcolor: colors.chartHoverBg,
      bordercolor: colors.border,
      font: { family: 'Inter, system-ui, sans-serif', size: 12, color: colors.text },
    },
  }
}

// Animation keyframes as CSS string
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: #0a0a0f;
    color: #e4e4e7;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.011em;
  }

  /* x.ai/Tesla typography system */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  /* Body text - slightly tighter */
  p, span, div {
    letter-spacing: -0.011em;
  }

  /* Labels and small text - x.ai style */
  .label, [data-label], small {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  /* Buttons - x.ai style */
  button {
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  /* Accessibility: Focus styles */
  :focus {
    outline: none;
  }

  :focus-visible {
    outline: 2px solid rgba(6, 182, 212, 0.6);
    outline-offset: 2px;
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :root {
      --focus-ring-color: #00ffff;
    }

    :focus-visible {
      outline: 3px solid var(--focus-ring-color);
      outline-offset: 2px;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  /* Animation keyframes */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(6, 182, 212, 0.3); }
    50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
  }

  /* Utility classes for animations */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out forwards;
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.03) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  /* Staggered animation delays */
  .stagger-1 { animation-delay: 0.1s; opacity: 0; }
  .stagger-2 { animation-delay: 0.2s; opacity: 0; }
  .stagger-3 { animation-delay: 0.3s; opacity: 0; }
  .stagger-4 { animation-delay: 0.4s; opacity: 0; }
  .stagger-5 { animation-delay: 0.5s; opacity: 0; }

  /* Glass morphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .glass-hover:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
  }

  /* Glow effects */
  .glow-cyan {
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
  }

  .glow-orange {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
  }

  /* Number input styling */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Range slider custom styling */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(to right, #06b6d4 0%, #06b6d4 var(--slider-progress, 50%), #374151 var(--slider-progress, 50%), #374151 100%);
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #06b6d4;
    cursor: pointer;
    border: 2px solid #0a0a0f;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    transition: all 0.15s ease;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
  }

  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #06b6d4;
    cursor: pointer;
    border: 2px solid #0a0a0f;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid rgba(6, 182, 212, 0.5);
    outline-offset: 2px;
  }

  /* Selection */
  ::selection {
    background: rgba(6, 182, 212, 0.3);
    color: white;
  }
`

// Station colors for charts (consistent palette)
export const STATION_COLORS = [
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ef4444', // red
  '#ec4899', // pink
  '#3b82f6', // blue
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
] as const

// Chart theme configuration
export const chartTheme = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: {
    family: 'Inter, system-ui, sans-serif',
    color: '#a1a1aa',
    size: 12,
  },
  xaxis: {
    gridcolor: 'rgba(255, 255, 255, 0.05)',
    linecolor: 'rgba(255, 255, 255, 0.1)',
    tickfont: { size: 11, color: '#71717a' },
    title: { font: { size: 12, color: '#a1a1aa' } },
  },
  yaxis: {
    gridcolor: 'rgba(255, 255, 255, 0.05)',
    linecolor: 'rgba(255, 255, 255, 0.1)',
    tickfont: { size: 11, color: '#71717a' },
    title: { font: { size: 12, color: '#a1a1aa' } },
    zeroline: true,
    zerolinecolor: 'rgba(255, 255, 255, 0.15)',
  },
  legend: {
    font: { size: 11, color: '#a1a1aa' },
    bgcolor: 'transparent',
  },
  hoverlabel: {
    bgcolor: '#18181b',
    bordercolor: 'rgba(255, 255, 255, 0.1)',
    font: { family: 'Inter, system-ui, sans-serif', size: 12, color: '#e4e4e7' },
  },
}
