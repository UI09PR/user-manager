<template>
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div :class="['modal-content', customClass]">
        <div class="modal-header flex justify-between items-center border-b pb-2">
          <h3 class="text-lg font-semibold text-[#000]">{{ title }}</h3>
          <button @click="closeModal" class="text-xl font-bold">&times;</button>
        </div>
        <div class="modal-body py-4 text-[#000]">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer flex justify-end space-x-2 border-t pt-2 text-[#000]">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps<{
    isVisible: boolean;
    title?: string;
    customClass?: string;
  }>();
  
  
  const emit = defineEmits(['close']);
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal-content {
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    max-width: 90%;
    width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  