import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/tic-tac-toe/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})