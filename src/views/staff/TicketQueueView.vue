<script setup lang="ts">
import { useTicketQueue } from '@/composables/useTicketQueue'
import StatusBadge from '@/components/StatusBadge.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { TicketStatus } from '@/types/domain'

const { loading, pageItems, totalPages, status, search, page, setStatus, setSearch, setPage } = useTicketQueue()

const statuses: TicketStatus[] = ['new', 'in_progress', 'resolved', 'cancelled']
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-semibold text-gray-900">Ticket queue</h1>

    <div class="mb-4 flex flex-wrap gap-3">
      <select
        :value="status ?? ''"
        class="rounded-md border border-gray-300 px-3 py-2"
        @change="setStatus((($event.target as HTMLSelectElement).value || undefined) as TicketStatus | undefined)"
      >
        <option value="">All statuses</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>

      <input
        :value="search"
        placeholder="Search subject or reference…"
        class="flex-1 rounded-md border border-gray-300 px-3 py-2"
        @input="setSearch(($event.target as HTMLInputElement).value)"
      />
    </div>

    <p v-if="loading" class="text-gray-500">Loading…</p>

    <table v-else class="w-full border-collapse text-left text-sm">
      <thead>
        <tr class="border-b border-gray-200 text-gray-500">
          <th class="py-2">Reference</th>
          <th class="py-2">Subject</th>
          <th class="py-2">Status</th>
          <th class="py-2">Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ticket in pageItems"
          :key="ticket.id"
          class="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
          @click="$router.push(`/staff/tickets/${ticket.id}`)"
        >
          <td class="py-3 font-mono">{{ ticket.reference }}</td>
          <td class="py-3">{{ ticket.subject }}</td>
          <td class="py-3"><StatusBadge :status="ticket.status" /></td>
          <td class="py-3 text-gray-500">{{ new Date(ticket.updatedAt).toLocaleDateString() }}</td>
        </tr>
        <tr v-if="pageItems.length === 0">
          <td colspan="4" class="py-6 text-center text-gray-400">No tickets match these filters.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading" class="mt-4 flex items-center justify-between">
      <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="setPage(page - 1)">Previous</BaseButton>
      <span class="text-sm text-gray-500">Page {{ page }} of {{ totalPages }}</span>
      <BaseButton variant="secondary" size="sm" :disabled="page >= totalPages" @click="setPage(page + 1)">Next</BaseButton>
    </div>
  </main>
</template>