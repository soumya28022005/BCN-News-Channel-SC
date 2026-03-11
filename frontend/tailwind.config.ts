import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bcn-red': '#E53E3E',
        'bcn-dark': '#0A0A0F',
        'bcn-darker': '#06060A',
        'bcn-card': '#111118',
        'bcn-border': '#1E1E2E',
        'bcn-light': '#E2E8F0',
        'bcn-muted': '#64748B',
        'bcn-gold': '#F6AD55',
      },
      fontFamily: {
        bangla: ['var(--font-bangla)', 'Georgia', 'serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;