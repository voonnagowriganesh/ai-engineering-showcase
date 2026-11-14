/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FBF8F2',
          deep: '#F2ECE0',
          line: '#E6DFD1',
        },
        ink: {
          DEFAULT: '#1B1712',
          soft: '#564E45',
          faint: '#8A8075',
        },
        signal: {
          DEFAULT: '#4338CA',
          deep: '#2D2583',
          light: '#6E62E8',
        },
        amber: {
          DEFAULT: '#E8793C',
          deep: '#C45D24',
          light: '#F5A868',
        },
        sage: {
          DEFAULT: '#2F7A64',
          light: '#58A98C',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(27, 23, 18, 0.05)',
        card: '0 1px 2px rgba(27,23,18,0.04), 0 12px 32px -12px rgba(27,23,18,0.14)',
        lift: '0 24px 60px -20px rgba(67, 56, 202, 0.35)',
        glow: '0 0 0 1px rgba(232,121,60,0.25), 0 20px 50px -18px rgba(232,121,60,0.45)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'float-y': 'float-y 7s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
}
