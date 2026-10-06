import type { TicketStatus } from './domain'
export const TICKET_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  new: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: [],
  cancelled: [],
}

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  return TICKET_TRANSITIONS[from].includes(to)
}