<script setup lang="ts">
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex justify-end border-b border-gray-200 px-4 py-3">
      <RouterLink to="/login" class="text-sm text-gray-500 hover:text-gray-700">
        Staff login
      </RouterLink>
    </header>
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>