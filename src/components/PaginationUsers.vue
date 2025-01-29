<template>
  <div class="flex items-center gap-2 mt-4 text-[0.5em] md:text-base">
    <component
      :is="AsyncButton"
      :disabled="currentPage === 1"
      @click="goToPage(1)"
      variant="dark-secondary"
      class="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
    >
      Первая
    </component>

    <component
      :is="AsyncButton"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
      variant="dark-secondary"
      class="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 hidden md:flex"
    >
      Назад
    </component>

    <div v-for="page in visiblePages" :key="page" class="cursor-pointer">
      <button
        @click="goToPage(page)"
        :class="[
          'px-4 py-2 rounded-lg',
          page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
        ]"
      >
        {{ page }}
      </button>
    </div>

    <component
      :is="AsyncButton"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
      variant="dark-secondary"
      class="px-4 py-2 rounded-lg disabled:opacity-50 hidden md:flex"
    >
      Вперёд
    </component>

    <component
      :is="AsyncButton"
      :disabled="currentPage === totalPages"
      @click="goToPage(totalPages)"
      variant="dark-secondary"
      class="px-4 py-2 rounded-lg disabled:opacity-50"
    >
      Последняя
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
const AsyncButton = defineAsyncComponent(() => import("@/components/ui/Button.vue"));

const { totalPages, currentPage } = defineProps<{ totalPages: number; currentPage: number }>();

const emit = defineEmits<{
  (e: "pageChange", page: number): void;
}>();

const visiblePages = computed(() => {
  const pages: number[] = [];
  const minPage = 1;
  const maxPage = totalPages;
  const delta = 1;

  for (let i = Math.max(minPage, currentPage - delta); i <= Math.min(maxPage, currentPage + delta); i++) {
    pages.push(i);
  }
  return pages;
});
const goToPage = (page: number) => {
  if (page !== currentPage && page >= 1 && page <= totalPages) {
    emit("pageChange", page);
  }
};
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
}
</style>
