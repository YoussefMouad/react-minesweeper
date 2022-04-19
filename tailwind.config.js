module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
      }
    }
  },
  plugins: [],
  darkMode: 'media',
}
