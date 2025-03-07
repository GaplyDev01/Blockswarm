/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        'dark-bg': '#000000', // Pure black background
        'dark-card': '#0C1016', // Very dark gray for cards
        'dark-border': '#169976', // Viridian for borders
        'dark-text': '#FFFFFF',
        'dark-subtext': '#A1A1AA',
        'dark-accent': '#169976', // Viridian
        'dark-highlight': '#50C878', // Smaragdine
        
        // Light mode colors
        'light-bg': '#F4F6F2',
        'light-card': '#FFFFFF',
        'light-border': '#169976', // Emerald
        'light-text': '#121010', // Sable
        'light-subtext': '#4B5563',
        'light-accent': '#169976', // Emerald
        'light-highlight': '#50C878', // Smaragdine
        
        // Custom colors
        'sable': '#121010',
        'viridian': '#169976',
        'smaragdine': '#50C878',
        'emerald': '#107e57',
        'lime': '#a1ce3f',
        'mint': '#cbe58e',
        'forest': '#013026',
        'navy': '#014760',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
};