<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import FormField from '@/components/FormField.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const submitting = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  submitting.value = true
  error.value = null
    try {
    await authStore.login(form.email, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/staff/tickets'
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
    <h1 class="mb-6 text-2xl font-semibold text-gray-900">Staff login</h1>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <FormField label="Email">
        <input v-model="form.email" type="email" required class="rounded-md border border-gray-300 px-3 py-2" />
      </FormField>
      <FormField label="Password">
        <input v-model="form.password" type="password" required class="rounded-md border border-gray-300 px-3 py-2" />
      </FormField>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <BaseButton type="submit" :disabled="submitting">
        {{ submitting ? 'Signing in…' : 'Sign in' }}
      </BaseButton>
    </form>
  </main>
</template>