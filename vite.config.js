import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setupTests.ts", 
    globals: true,
    css: true,
    coverage: {
      provider: "v8", 
      reporter: ["text", "html"], 
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx,ts,tsx}"], 
      exclude: [
        "src/main.jsx",      
        "src/**/__tests__/**", 
        "src/test/**",       
      ],
    },
  },
});