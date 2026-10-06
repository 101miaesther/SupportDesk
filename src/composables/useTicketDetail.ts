import { computed, ref } from 'vue'
import { ticketRepository } from '@/data/ticketRepository'
import { canTransition } from '@/types/transitions'
import type { Ticket, TicketEvent, TicketStatus, User } from '@/types/domain'

const ALL_STATUSES: TicketStatus[] = ['new', 'in_progress', 'resolved', 'cancelled']

export function useTicketDetail(ticketId: string) {
  const ticket = ref<Ticket | null>(null)
  const events = ref<TicketEvent[]>([])
  const loading = ref(true)
  const actionError = ref<string | null>(null)

  async function load() {
    loading.value = true
    ticket.value = (await ticketRepository.getById(ticketId)) ?? null
    if (ticket.value) events.value = await ticketRepository.getEvents(ticket.value.id)
    loading.value = false
  }
  load()

  const availableTransitions = computed<TicketStatus[]>(() =>
    ticket.value ? ALL_STATUSES.filter(s => canTransition(ticket.value!.status, s)) : []
  )

  async function changeStatus(to: TicketStatus, actor: User) {
    if (!ticket.value) return
    actionError.value = null
    try {
      ticket.value = await ticketRepository.updateStatus(ticket.value.id, to, actor)
      events.value = await ticketRepository.getEvents(ticket.value.id)
    } catch (e) {
      actionError.value = e instanceof Error ? e.message : 'Action failed'
    }
  }

  async function assignToSelf(actor: User) {
    if (!ticket.value) return
    ticket.value = await ticketRepository.assign(ticket.value.id, actor.id, actor)
    events.value = await ticketRepository.getEvents(ticket.value.id)
  }

  async function postResponse(message: string, isInternal: boolean, actor: User) {
    if (!ticket.value) return
    await ticketRepository.respond(ticket.value.id, message, isInternal, actor)
    events.value = await ticketRepository.getEvents(ticket.value.id)
  }

  return { ticket, events, loading, actionError, availableTransitions, changeStatus, assignToSelf, postResponse }
}