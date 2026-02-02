<template>
  <div v-if="loading" class="fixed w-full h-full text-white z-[1000] flex-center bg-[#000] opacity-[0.8]">
     <div class="rotating-object w-[15vw] h-[15vw] rounded-[50%] border-r-4 border-b-4"></div>
  </div>
  <div
    v-if="error"
    class="fixed w-full h-full text-xl text-white z-[1000] flex-center flex-col gap-5 bg-[#000] opacity-[0.5]"
  >
    error...
    <p>
      {{ error }}
    </p>
    <component :is="AsyncButton" variant="active" class="text-xl p-4" @click="() => userStore.fetchUsers()">Попробовать снова</component>
  </div>
  <div
    class="flex-center w-full min-h-screen flex-start flex-col bg-gradient-to-b from-gray-900 to-black text-white"
  >
    <NuxtPage />
    <component :is="AsyncToast" />
  </div>
</template>

<script setup lang="ts">
import { useToastsStore } from "@/stores/toasts";
import { computed, defineAsyncComponent, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/stores/users";
import { useKeyboardStore } from "@/stores/keyboard";

const AsyncButton = defineAsyncComponent(() => import("@/components/ui/Button.vue"));
const AsyncToast = defineAsyncComponent(() => import("@/components/ui/Toast.vue"));

const userStore = useUserStore();
const keyboardStore = useKeyboardStore()
const toastsStore = useToastsStore();
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);
onMounted(() => {
  window.addEventListener("keydown", keyboardStore.handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", keyboardStore.handleKeyDown);
});
</script>

<style scoped>
.rotating-object {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
