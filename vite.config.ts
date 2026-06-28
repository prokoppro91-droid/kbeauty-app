import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base = ім'я репозиторію для GitHub Pages (prokoppro91-droid.github.io/kbeauty-app/)
export default defineConfig({
  base: '/kbeauty-app/',
  plugins: [react(), tailwindcss()],
})
