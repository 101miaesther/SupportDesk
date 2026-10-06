<script setup lang="ts">
import type { TicketStatus } from '@/types/domain'
import { STATUS_LABEL, STATUS_BADGE_CLASS } from '@/lib/statusStyles'

defineProps<{ status: TicketStatus }>()
</script>

<template>
  <span :class="['rounded-full px-3 py-1 text-sm font-medium', STATUS_BADGE_CLASS[status]]">
    {{ STATUS_LABEL[status] }}
  </span>
</template>