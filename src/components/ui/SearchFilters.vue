<template>
  <div class="search-input flex-between gap-2">
    <Button
      :icon="order === 'DESC' ? 'arrow-up-z-a' : 'arrow-down-z-a'"
      @click="emitOrderChange"
      class="px-4 text-xl"
    >
    </Button>
    <select
      v-model="initialSort"
      @change="emitSortChange"
      class="px-4 py-3 rounded-lg bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
    >
      <option value="createdAt">Создан</option>
      <option value="updatedAt">Изменен</option>
    </select>
    <input
      type="text"
      @input="handleInput"
      placeholder="Введите текст для поиска"
      class="border px-4 py-2 rounded-lg shadow-md w-full text-[#000]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "./Button.vue";

const { debounceTime, sort, order } = defineProps<{
  debounceTime: number;
  sort: "createdAt" | "updatedAt";
  order: "ASC" | "DESC";
}>();

const initialSort = ref(sort);

const emit = defineEmits<{
  (e: "searchChange", value: string): void;
  (e: "sortChange", value: "createdAt" | "updatedAt"): void;
  (e: "orderChange", value: "ASC" | "DESC"): void;
}>();

const emitSortChange = () => {
  emit("sortChange", initialSort.value);
};

const emitOrderChange = () => {
  emit("orderChange", order === "ASC" ? "DESC" : "ASC");
};

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const handleInput = (e: InputEvent) => {
  const target = e.target as HTMLInputElement;
  const text = target.value;

  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(() => {
    emit("searchChange", text);
  }, debounceTime ?? 500);
};
</script>

<style scoped>
.search-input input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.6);
}
</style>
