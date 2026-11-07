/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0C140E',        // Deep charcoal with green undertone
          sidebar: '#0E1B13',   // Dark forest green sidebar
          card: '#142319',      // Dashboard cards and panel surfaces
          surface: '#18291E',   // Inputs, hover states, secondary surfaces
          hover: '#1F3427',     // Interactive element hover
          border: '#233B2B',    // Subtle dark borders
          'border-light': '#2D4B38',
          text: '#F5EFE6',      // Primary near-white/beige text
          muted: '#9EAEA3',     // Muted secondary text
          dim: '#6E7F74'        // Dim icons and breadcrumbs
        },
        forest: {
          50: '#F1F6F2',
          100: '#DFECE2',
          200: '#C0D9C6',
          300: '#94BE9E',
          400: '#649E72',
          500: '#407D50',
          600: '#2F643E',
          700: '#28523A',
          800: '#1F3D2B', // Main Forest Green #1F3D2B
          900: '#152C1E',
          950: '#0C1B12',
        },
        sand: {
          50: '#FAF8F4',
          100: '#F5EFE6',
          200: '#E8DCC4', // Main Sand Beige #E8DCC4
          300: '#D8C7A4',
          400: '#C2AB7E',
          500: '#A98F5C',
          600: '#8A7146',
          700: '#6E5738',
          800: '#58462F',
          900: '#493B29',
        },
        electric: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6', // Main Electric Purple #8B5CF6
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.2)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
        'popover': '0 10px 35px -5px rgba(0, 0, 0, 0.5)',
        'purple-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
