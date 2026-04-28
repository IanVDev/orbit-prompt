import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#07080b',
          raised: '#0c0e13',
          subtle: '#11141b',
        },
        border: {
          DEFAULT: '#1c2030',
          strong: '#2a3045',
        },
        fg: {
          DEFAULT: '#e7eaf3',
          muted: '#9aa3b8',
          subtle: '#6b7290',
        },
        accent: {
          DEFAULT: '#7c8cff',
          strong: '#5d6ff5',
          glow: '#9aa7ff',
        },
        success: '#52d9a3',
        warn: '#ffb454',
        danger: '#ff6b81',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,140,255,0.25), 0 12px 40px -8px rgba(124,140,255,0.30)',
      },
      backgroundImage: {
        'orbit-gradient':
          'radial-gradient(60% 40% at 50% 0%, rgba(124,140,255,0.18) 0%, rgba(7,8,11,0) 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
