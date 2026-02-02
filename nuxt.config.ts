import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true,
  pages: true,
  compatibilityDate: "2025-01-26",
  devtools: { enabled: true },
  css: ["@/assets/css/tailwind.css"],
  modules: ["@nuxtjs/tailwindcss"],
  plugins: [{ src: "~/plugins/font-awesome.ts", mode: "client" }],
  srcDir: "src/",
  devServer: {
    port: process.env.CLIENT_PORT ? Number(process.env.CLIENT_PORT) : 3000,
  },
  vite: {
    server: {
      proxy: {
        "/api/": {
          target: process.env.SERVER_API_URL || "http://127.0.0.1:4020",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});
