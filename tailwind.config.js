/** @type {import('tailwindcss').Config} */

// 정부 R&D 포털 톤의 블루 스케일 (900 = 메인 네이비, 500 = 포인트 로열블루)
const brandBlue = {
  50: '#f2f6fb',
  100: '#e4ebf7',
  200: '#c7d3ea',
  300: '#9fb3e0',
  400: '#6b8be6',
  500: '#4169e1',
  600: '#3a5fd0',
  700: '#3152bb',
  800: '#2846a6',
  900: '#1d3994',
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: brandBlue,
        blue: brandBlue,
        navy: {
          DEFAULT: '#1d3994',
          deep: '#15295f',
          ink: '#1a2440',
        },
        royal: '#4169e1',
        surface: '#f2f6fb',
        line: '#e3e5e8',
        ink: '#1d1d1d',
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        'pretendard': ['"Pretendard GOV Variable"', '"Pretendard GOV"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'site': '1280px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(29, 57, 148, 0.06)',
        'card-hover': '0 10px 28px rgba(29, 57, 148, 0.14)',
        'mega': '0 18px 30px -12px rgba(16, 32, 80, 0.18)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
