import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        surface: {
          DEFAULT: '#1a1a1d',
          light: '#252529',
        },
        primary: {
          DEFAULT: '#00d9ff',
          dark: '#00b8db',
          light: '#33e3ff',
        },
        accent: {
          magenta: '#ff006e',
          purple: '#8338ec',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a8',
          muted: '#6e6e76',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
