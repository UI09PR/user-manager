<template>
  <div class="w-full min-h-screen flex-start flex-col">
    <div class="mt-8 ml-8 flex flex-col gap-4">
      <h1 class="text-4xl font-bold">Главная страница</h1>
      <h3 class="text-2xl font-semibold">Менеджер пользователей</h3>
      <div class="mt-5 flex-between">
        <a
          href="https://github.com/UI09PR"
          target="_blank"
          class="flex-center gap-3 p-2 px-4 rounded-2xl bg-gray-700"
          :class="{ 'outline outline-2 outline-red-600': keyboardStore.currentIndexX === 1 }"
          @mouseover="keyboardStore.currentIndexX = 1"
        >
          <p class="text-xl">GitHub</p>
          <div class="bg-gray-900 border cursor-pointer w-10 h-10 rounded-[50%]">
            <component :is="AsyncGitHub" />
          </div>
        </a>
        <router-link
          to="/users"
          :class="{ 'outline outline-2 outline-red-600': keyboardStore.currentIndexX === 2 }"
          class="bg-white text-blue-700 px-6 py-3 rounded-xl shadow-lg hover:bg-blue-300 hover:text-[#000] transition duration-300 ease-in-out"
          @mouseover="keyboardStore.currentIndexX = 2"
        >
          Начать
        </router-link>
      </div>
    </div>
    <div class="flex justify-between items-start w-full flex-col gap-5 mt-10">
      <div class="flex-start ml-5">
        <div class="rounded-[50%] w-20 h-20 bg-gray-500 border">
          <img src="https://avatars.githubusercontent.com/u/27613489" alt="" class="rounded-[50%] w-20 bg-gray-50" />
        </div>
        <div class="rounded-[50%] w-20 h-20 bg-gray-500 border -ml-5">
          <img src="https://avatars.githubusercontent.com/u/55189552" alt="" class="rounded-[50%] w-20 bg-gray-500" />
        </div>
        <div class="rounded-[50%] w-20 h-20 bg-gray-500 border -ml-5">
          <img src="https://avatars.githubusercontent.com/u/18957479" alt="" class="rounded-[50%] w-20 bg-gray-500" />
        </div>
        <div class="rounded-[50%] w-20 h-20 bg-gray-500 border -ml-5">
          <img src="https://avatars.githubusercontent.com/u/94172783" alt="" class="rounded-[50%] w-20 bg-gray-500" />
        </div>
        <div class="rounded-[50%] w-20 h-20 bg-gray-500 border -ml-5">
          <img src="https://avatars.githubusercontent.com/u/86623445" alt="" class="rounded-[50%] w-20 bg-gray-500" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKeyboardStore } from "@/stores/keyboard";
import { useUserStore } from "@/stores/users";
import { defineAsyncComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
const AsyncGitHub = defineAsyncComponent(() => import("@/components/ui/GitHub.vue"));

const userStore = useUserStore();
const keyboardStore = useKeyboardStore();
const router = useRouter();

const redirectToGithub = () => {
  window.location.href = "https://github.com/UI09PR";
};

onMounted(() => {
  keyboardStore.setCurrent("main");
  keyboardStore.setFunction(() => (keyboardStore.currentIndexX === 2 ? router.push("/users") : redirectToGithub()));
  keyboardStore.currentIndexX = 2;
  keyboardStore.currentIndexXMax = 2;
  userStore.loading = false;
});
</script>
