import { ref } from 'vue'
import { ticketRepository } from '@/data/ticketRepository'
import type { Ticket, TicketEvent } from '@/types/domain'

export function useTrackTicket(initialReference?: string) {
  const referenceInput = ref(initialReference ?? '')
  const ticket = ref<Ticket | null>(null)
  const events = ref<TicketEvent[]>([])
  const loading = ref(false)
  const notFound = ref(false)

  async function search() {
    if (!referenceInput.value.trim()) return
    loading.value = true
    notFound.value = false
    ticket.value = null
    try {
      const found = await ticketRepository.getByReference(referenceInput.value.trim().toUpperCase())
      if (!found) {
        notFound.value = true
        return
      }
      ticket.value = found
      // public view — internal notes are filtered out here, not just hidden in the template
      const allEvents = await ticketRepository.getEvents(found.id)
      events.value = allEvents.filter(e => e.type !== 'responded_internal')
    } finally {
      loading.value = false
    }
  }

  if (initialReference) search()

  return { referenceInput, ticket, events, loading, notFound, search }
}