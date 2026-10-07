<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-5xl flex-col items-center gap-10 px-4 py-12 lg:flex-row lg:gap-16">
    <div class="w-full lg:w-1/2">
      <img
        src="@/assets/landingimg.jpg"
        alt=""
        class="w-full rounded-xl object-cover"
      />
    </div>

    <div class="flex w-full flex-col items-start gap-6 text-left lg:w-1/2">
      <h1 class="text-3xl font-bold text-gray-500">SupportDesk</h1>
      <p class="max-w-md text-gray-600">
        Have an issue? Submit a ticket and we'll get back to you.Already have a reference code? Track its status below.
      </p>
      <div class="flex gap-4">
        <RouterLink to="/submit">
          <BaseButton variant="accent">Submit a ticket</BaseButton>
        </RouterLink>
        <RouterLink to="/track">
          <BaseButton variant="secondary">Track a ticket</BaseButton>
        </RouterLink>
      </div>
    </div>
  </main>
</template>