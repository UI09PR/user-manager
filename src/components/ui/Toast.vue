<template>
  <div class="fixed bottom-4 right-4 w-[300px] space-y-2">
    <div
      v-for="(toast, index) in toasts"
      :key="toast.id"
      :class="['toast', toast.fadeOut ? 'fadeOut' : '', getToastClass(toast.type)]"
      class="p-4 rounded-lg shadow flex items-center justify-between w-full gap-2"
    >
      <p class="text-gray-400 text-xs">{{ toast.time / 1000 }}s</p>
      <div class="w-full flex flex-row items-start fustify-start">
        <p class="whitespace-normal break-all">{{ toast.message }}</p>
        <slot name="action"></slot>
      </div>
      <button @click="removeToast(index)" class="ml-4 text-lg font-bold">&times;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ToastType, useToastsStore } from "@/stores/toasts";
const notesStore = useToastsStore();
const toasts = notesStore.toasts;

const removeToast = (index: number) => {
  notesStore.removeToast(index);
};
const getToastClass = (type: ToastType) => {
  switch (type) {
    case "error":
      return "border border-red-500 text-red-500";
    case "success":
      return "border border-green-500 text-green-500";
    case "info":
    default:
      return "border border-gray-500 text-gray-500";
  }
};
</script>

<style scoped>
.toast {
  background: white;
  border-width: 2px;
  animation: slide-in 0.3s ease-out;
}

.fadeOut {
  animation: fade-out 0.3s ease-out;
}

.toast-progress {
  animation: time-out var(--toast-time) linear forwards;
  transform-origin: left;
}
@keyframes slide-in {
  from {
    transform: translateY(1em);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes time-out {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@keyframes fade-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(1em);
    opacity: 0;
  }
}
</style>
