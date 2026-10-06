<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <label class="flex flex-col gap-1">
    <span class="text-sm font-medium text-gray-700">{{ label }}</span>
    <slot />
  </label>
</template>