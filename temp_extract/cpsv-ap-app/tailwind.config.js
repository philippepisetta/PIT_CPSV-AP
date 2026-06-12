/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e', // teal-700
        accent: '#3b82f6', // blue-500
        background: '#ffffff',
        surface: '#f3f4f6', // gray-100
        text: '#1f2937', // gray-800
        muted: '#9ca3af', // gray-400
      },
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.1)',
        glass: '0 8px 32px rgba(0,0,0,0.15)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
