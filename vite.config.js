import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app at https://itu-tid.github.io/todo-26/, not at the root
  base: "/todo-26/",
})
