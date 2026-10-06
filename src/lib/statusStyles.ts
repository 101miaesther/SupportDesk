import type { TicketStatus } from '@/types/domain'

export const STATUS_LABEL: Record<TicketStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  resolved: 'Resolved',
  cancelled: 'Cancelled',
}

export const STATUS_BADGE_CLASS: Record<TicketStatus, string> = {
  new: 'bg-status-new/10 text-status-new',
  in_progress: 'bg-status-progress/10 text-status-progress',
  resolved: 'bg-status-resolved/10 text-status-resolved',
  cancelled: 'bg-status-cancelled/10 text-status-cancelled',
}