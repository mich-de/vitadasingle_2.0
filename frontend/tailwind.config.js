/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'primary-light': '#4361EE',
        'secondary-light': '#3CCFCF',
        'accent-light': '#F72585',
        'background-light': '#F8FAFC',
        'card-light': '#FFFFFF',
        'text-primary-light': '#1E293B',
        'text-secondary-light': '#64748B',
        'border-light': '#E2E8F0',

        // Dark theme colors
        'primary-dark': '#6366F1',
        'secondary-dark': '#2DD4BF',
        'accent-dark': '#EC4899',
        'background-dark': '#0F172A',
        'card-dark': '#1E293B',
        'text-primary-dark': '#F1F5F9',
        'text-secondary-dark': '#94A3B8',
        'border-dark': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'soft-md': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'neon': '0 0 5px rgba(67, 97, 238, 0.3), 0 0 10px rgba(67, 97, 238, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}