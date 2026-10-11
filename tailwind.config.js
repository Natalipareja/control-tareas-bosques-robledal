/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vibrant: {
          green: '#10b981', // Completado
          orange: '#f59e0b', // En proceso
          red: '#ef4444', // Vencido
        }
      }
    },
  },
  plugins: [],
}
