<script setup lang="ts">
import { useTrackTicket } from '@/composables/useTrackTicket'
import BaseButton from '@/components/BaseButton.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps<{ reference?: string }>()
const { referenceInput, ticket, events, loading, notFound, search } = useTrackTicket(props.reference)
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-12">
    <h1 class="text-2xl font-semibold text-gray-900">Track a ticket</h1>

    <form class="mt-6 flex gap-2" @submit.prevent="search">
      <input
        v-model="referenceInput"
        placeholder="Input your ticket ID, for example SD-XXXXX"
        class="flex-1 rounded-md border border-gray-300 px-3 py-2 font-mono uppercase"
      />
      <BaseButton type="submit">Search</BaseButton>
    </form>

    <p v-if="loading" class="mt-6 text-gray-500">Loading…</p>
    <p v-else-if="notFound" class="mt-6 text-red-600">No ticket found with that reference.</p>

    <div v-else-if="ticket" class="mt-6 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="font-medium text-gray-900">{{ ticket.subject }}</h2>
        <StatusBadge :status="ticket.status" />
      </div>

      <ul v-if="events.length" class="flex flex-col gap-3 border-t border-gray-200 pt-4">
        <li v-for="event in events" :key="event.id" class="text-sm text-gray-600">
          <span class="font-mono text-xs text-gray-400">{{ new Date(event.createdAt).toLocaleString() }}</span>
          <p>{{ event.message ?? event.type }}</p>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-400">No updates yet.</p>
    </div>
  </main>
</template>