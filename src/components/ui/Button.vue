<template>
  <button :class="['btn', buttonClass]" :disabled="disabled">
    <FontAwesomeIcon v-if="icon && !loading" :icon="icon" :size="iconSize" :class="{'w-[100%]': !noSafari}" />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/vue-fontawesome";
import { getStyleByVariant } from "@/utils/get-class-by-variant";
import { VariantType } from "@/types/index";

const props = defineProps<{
  icon?: string;
  class?: string;
  disabled?: boolean;
  size?: FontAwesomeIconProps["size"];
  variant?: VariantType;
  noSafari?: boolean;
  loading?: boolean;
}>();
const width = window?.innerWidth;

const iconSize = computed(() => {
  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "lg";
  return "xl";
});

const buttonClass = computed(() => {
  return `p-2 rounded-lg focus:outline-none focus:ring-2 text-white text-center ${getStyleByVariant(
    props.variant ?? "secondary"
  )} ${props.class}`;
});
</script>
