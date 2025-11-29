/**
 * Custom theme configuration for Climate Data Explorer
 * Tesla-inspired dark theme with premium feel
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
        // Surface colors for dark theme
        surface: {
          bg: { value: '#0a0a0f' },
          card: { value: 'rgba(255, 255, 255, 0.03)' },
          cardHover: { value: 'rgba(255, 255, 255, 0.06)' },
          border: { value: 'rgba(255, 255, 255, 0.08)' },
          borderHover: { value: 'rgba(255, 255, 255, 0.15)' },
        },
        // Accent colors
        accent: {
          cyan: { value: '#06b6d4' },
          cyanGlow: { value: 'rgba(6, 182, 212, 0.15)' },
          orange: { value: '#f59e0b' },
          orangeGlow: { value: 'rgba(245, 158, 11, 0.15)' },
          purple: { value: '#8b5cf6' },
          purpleGlow: { value: 'rgba(139, 92, 246, 0.15)' },
          emerald: { value: '#10b981' },
          emeraldGlow: { value: 'rgba(16, 185, 129, 0.15)' },
        },
      },
      fonts: {
        heading: { value: '"Outfit", "Inter", system-ui, sans-serif' },
        body: { value: '"Inter", system-ui, sans-serif' },
        mono: { value: '"JetBrains Mono", "Fira Code", monospace' },
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

// Animation keyframes as CSS string
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: #0a0a0f;
    color: #e4e4e7;
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
