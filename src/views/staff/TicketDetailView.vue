<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTicketDetail } from '@/composables/useTicketDetail'
import StatusBadge from '@/components/StatusBadge.vue'
import BaseButton from '@/components/BaseButton.vue'
import { STATUS_LABEL } from '@/lib/statusStyles'
import type { TicketStatus } from '@/types/domain'

const props = defineProps<{ id: string }>()
const authStore = useAuthStore()
const { ticket, events, loading, actionError, availableTransitions, changeStatus, assignToSelf, postResponse } =
  useTicketDetail(props.id)

const responseMessage = ref('')
const isInternalNote = ref(false)

const visibleTransitions = computed<TicketStatus[]>(() =>
  authStore.currentUser?.role === 'supervisor'
    ? availableTransitions.value
    : availableTransitions.value.filter(s => s !== 'cancelled')
)

async function handleRespond() {
  if (!responseMessage.value.trim() || !authStore.currentUser) return
  await postResponse(responseMessage.value.trim(), isInternalNote.value, authStore.currentUser)
  responseMessage.value = ''
}

function handleStatusChange(to: TicketStatus) {
  if (authStore.currentUser) changeStatus(to, authStore.currentUser)
}

function handleAssignToSelf() {
  if (authStore.currentUser) assignToSelf(authStore.currentUser)
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-8">
    <p v-if="loading" class="text-gray-500">Loading…</p>
    <p v-else-if="!ticket" class="text-red-600">Ticket not found.</p>

    <div v-else class="flex flex-col gap-6">
      <div class="flex items-start justify-between">
        <div>
          <p class="font-mono text-sm text-gray-400">{{ ticket.reference }}</p>
          <h1 class="text-2xl font-semibold text-gray-900">{{ ticket.subject }}</h1>
        </div>
        <StatusBadge :status="ticket.status" />
      </div>

      <div class="rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
        <p><span class="font-medium text-gray-900">From:</span> {{ ticket.name }} ({{ ticket.email }})</p>
        <p class="mt-1"><span class="font-medium text-gray-900">Category:</span> {{ ticket.category }}</p>
        <p class="mt-2">{{ ticket.description }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <BaseButton v-if="!ticket.assigneeId" size="sm" variant="accent" @click="handleAssignToSelf">
          Assign to me
        </BaseButton>
        <BaseButton
          v-for="next in visibleTransitions"
          :key="next"
          size="sm"
          :variant="next === 'cancelled' ? 'danger' : 'secondary'"
          @click="handleStatusChange(next)"
        >
          Move to {{ STATUS_LABEL[next] }}
        </BaseButton>
      </div>
      <p v-if="actionError" class="text-sm text-red-600">{{ actionError }}</p>

      <div>
        <h2 class="mb-2 font-medium text-gray-900">Timeline</h2>
        <ul class="flex flex-col gap-3 border-t border-gray-200 pt-4">
          <li v-for="event in events" :key="event.id" class="text-sm text-gray-600">
            <span class="font-mono text-xs text-gray-400">{{ new Date(event.createdAt).toLocaleString() }}</span>
            <p>
              <span
                v-if="event.type === 'responded_internal'"
                class="mr-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700"
              >internal</span>
              {{ event.message ?? event.type }}
            </p>
          </li>
        </ul>
      </div>

      <form class="flex flex-col gap-2" @submit.prevent="handleRespond">
        <textarea
          v-model="responseMessage"
          rows="3"
          placeholder="Write a response…"
          class="rounded-md border border-gray-300 px-3 py-2"
        />
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input v-model="isInternalNote" type="checkbox" />
          Internal note (not visible to the citizen)
        </label>
        <BaseButton type="submit" size="sm">Post</BaseButton>
      </form>
    </div>
  </main>
</template>