import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        indigo: {
          600: '#4F46E5',
          700: '#4338CA',
        },
        emerald: {
          600: '#059669',
          700: '#047857',
        },
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        },
        rose: {
          600: '#E11D48',
          700: '#BE185D',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      spacing: {
        'sidebar': '280px',
      },
      transitionDuration: {
        '250': '250ms',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.08)',
        'card-hover': '0 4px 12px 0 rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config
