<script setup lang="ts">
import { useSubmitTicket } from '@/composables/useSubmitTicket'
import type { TicketCategory } from '@/types/domain'
import BaseButton from '@/components/BaseButton.vue'
import FormField from '@/components/FormField.vue'

const { form, submitting, error, createdTicket, submit } = useSubmitTicket()

const categories: TicketCategory[] = ['billing', 'technical', 'account', 'other']
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-12">
    <!-- success state -->
    <div v-if="createdTicket" class="rounded-lg border border-status-resolved/30 bg-status-resolved/5 p-6 text-center">
      <p class="text-gray-700">Ticket submitted. Your reference code is:</p>
      <p class="mt-2 text-2xl font-mono font-semibold text-status-resolved">{{ createdTicket.reference }}</p>
      <RouterLink :to="`/track/${createdTicket.reference}`" class="mt-4 inline-block text-brand-600 hover:underline">
        Track this ticket
      </RouterLink>
    </div>

    <!-- form state -->
    <form v-else class="flex flex-col gap-4" @submit.prevent="submit">
      <h1 class="text-2xl font-semibold text-gray-900">Submit a ticket</h1>

      <FormField label="Name">
        <input v-model="form.name" required class="rounded-md border border-gray-300 px-3 py-2" />
      </FormField>

      <FormField label="Email">
        <input v-model="form.email" type="email" required class="rounded-md border border-gray-300 px-3 py-2" />
      </FormField>

      <FormField label="Category">
        <select v-model="form.category" class="rounded-md border border-gray-300 px-3 py-2">
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </FormField>

      <FormField label="Subject">
        <input v-model="form.subject" required class="rounded-md border border-gray-300 px-3 py-2" />
      </FormField>

      <FormField label="Description">
        <textarea v-model="form.description" required rows="5" class="rounded-md border border-gray-300 px-3 py-2" />
      </FormField>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <BaseButton type="submit" :disabled="submitting">
        {{ submitting ? 'Submitting…' : 'Submit ticket' }}
      </BaseButton>
    </form>
  </main>
</template>
