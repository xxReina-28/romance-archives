import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/romance-archives/",
  plugins: [react()],
})
