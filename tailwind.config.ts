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
        primary: '#1a5c1a',
        navy: '#0d1b2a',
        accent: '#7bc61e',
        lightBg: '#f8fdf4',
        border: '#d4e8c2',
        textDark: '#1a1a1a',
        textLight: '#ffffff',
        insecticide: '#dc2626',
        fungicide: '#2563eb',
        herbicide: '#ea580c',
        pgr: '#9333ea',
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(26, 92, 26, 0.1)',
        'card-hover': '0 8px 30px rgba(26, 92, 26, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
