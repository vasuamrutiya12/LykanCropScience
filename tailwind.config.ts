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
        // Navy depth scale
        navy: {
          900: '#0F2E1F',
          800: '#1A3D2A',
          700: '#254B35',
          600: '#2F5940',
          500: '#3A6749',
        },
        // Accent greens
        accent: {
          100: '#F0F5E6',
          500: '#7CC93C',
          600: '#6BB32B',
          700: '#5A9D1A',
        },
        // Surface & text
        surface: '#F7F9F5',
        ink: '#1A1D1A',
        border: '#E3E8DE',
        textLight: '#ffffff',
        // Category colors
        insecticide: '#dc2626',
        fungicide: '#2563eb',
        herbicide: '#ea580c',
        pgr: '#9333ea',
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        gujarati: ['var(--font-noto-gujarati)', 'sans-serif'],
        devanagari: ['var(--font-noto-devanagari)', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.6' }],
        xl: ['20px', { lineHeight: '1.6' }],
        '2xl': ['24px', { lineHeight: '1.4' }],
        '3xl': ['30px', { lineHeight: '1.3' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        lg: '1rem',
        full: '9999px',
      },
      spacing: {
        section: '4rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 4px 12px rgba(15, 46, 31, 0.08)',
        'card-hover': '0 12px 24px rgba(15, 46, 31, 0.12)',
        'green-900/5': '0 4px 20px rgba(15, 46, 31, 0.05)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(to bottom, #0F2E1F, #1A3D2A)',
        'texture-leaf': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg opacity=\'0.03\'%3E%3Cpath d=\'M50 10 Q60 30 50 50 Q40 30 50 10\' fill=\'%230F2E1F\'/%3E%3C/g%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [],
};

export default config;
