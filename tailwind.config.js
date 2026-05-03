/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50:  '#EEEEFF',
          100: '#E0DFFF',
          200: '#C3C0FF',
          300: '#A09AFF',
          400: '#7B74F5',
          500: '#4F46E5',
          600: '#3525CD',
          700: '#2A1BAB',
          800: '#1D1280',
          900: '#110A56',
        },
        surface: {
          DEFAULT: '#F9F9F9',
          bright: '#F9F9F9',
          dim: '#DADADA',
          low:    '#F3F3F3',
          container: '#EEEEEE',
          high: '#E8E8E8',
          highest: '#E2E2E2',
          white: '#FFFFFF',
        },
        outline: {
          DEFAULT: '#777587',
          variant: '#C7C4D8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        card: '0px 1px 3px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.06)',
        hover: '0px 4px 12px rgba(0,0,0,0.06)',
        modal: '0px 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
