<script setup lang="ts">
import Button from "./components/ui/Button.vue";
import { useUserStore } from "./stores/users";
const userStore = useUserStore();
</script>

<template>
  <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <h2 class="text-[5em] font-semibold text-indigo-600">404</h2>
      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
        Страница не найдена
      </h1>
      <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 mb-5">Такой страницы нету...</p>
      <router-link to="/">
        <Button variant="active" icon="rotate-left" :loading="userStore.loading"> На главную </Button>
      </router-link>
    </div>
  </main>
</template>
