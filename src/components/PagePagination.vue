<template>
  <div class="text-xs md:text-xl font-bold text-gray-300 flex-center gap-2 no-wrap">
    <div v-for="path in paths" :key="path.to" class="flex items-center justify-start flex-row gap-2">
      <div class="cursor-pointer flex flex-row hover:text-gray-100">
        <router-link :to="path.to">{{ path.current }}</router-link>
      </div>
      <p>></p>
    </div>
    <p class="text-[#fff]">{{ target.current }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const { propsPaths } = defineProps<{ propsPaths: { to: string; current: string }[] }>();
const paths = reactive(
  Array.from(new Map(propsPaths.map(path => [path.current, path])).values())
);
const target = ref<{ to: string; current: string }>(paths.pop() ?? { to: "/", current: "" });
</script>
