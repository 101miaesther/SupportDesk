export type Role = 'agent' | 'supervisor'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'cancelled'

export type TicketCategory = 'billing' | 'technical' | 'account' | 'other'

export interface Ticket {
  id: string
  reference: string 
  name: string
  email: string
  category: TicketCategory
  subject: string
  description: string
  attachmentUrl?: string
  status: TicketStatus
  assigneeId?: string
  createdAt: string
  updatedAt: string
}

export type TicketEventType =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'responded_public'
  | 'responded_internal'

export interface TicketEvent {
  id: string
  ticketId: string
  type: TicketEventType
  actorId?: string // absent for the citizen's own submission event
  message?: string
  fromStatus?: TicketStatus
  toStatus?: TicketStatus
  createdAt: string
}