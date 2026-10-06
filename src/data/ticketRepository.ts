import type { Ticket, TicketCategory, TicketEvent, TicketStatus, User } from '@/types/domain'
import { canTransition } from '@/types/transitions'
//local storage

const TICKETS_KEY = 'supportdesk:tickets'
const EVENTS_KEY = 'supportdesk:events'

function readTickets(): Ticket[] {
  return JSON.parse(localStorage.getItem(TICKETS_KEY) ?? '[]')
}
function writeTickets(tickets: Ticket[]) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
}
function readEvents(): TicketEvent[] {
  return JSON.parse(localStorage.getItem(EVENTS_KEY) ?? '[]')
}
function writeEvents(events: TicketEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}
//random ref number generator
function generateReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `SD-${code}`
}

function logEvent(event: Omit<TicketEvent, 'id'>) {
  const events = readEvents()
  events.push({ id: crypto.randomUUID(), ...event })
  writeEvents(events)
}

export interface CreateTicketInput {
  name: string
  email: string
  category: TicketCategory
  subject: string
  description: string
  attachmentUrl?: string
}

export const ticketRepository = {
  async create(input: CreateTicketInput): Promise<Ticket> {
    const now = new Date().toISOString()
    const ticket: Ticket = { id: crypto.randomUUID(), reference: generateReference(), status: 'new', createdAt: now, updatedAt: now, ...input }
    const tickets = readTickets()
    tickets.push(ticket)
    writeTickets(tickets)
    logEvent({ ticketId: ticket.id, type: 'created', createdAt: now })
    return ticket
  },

  async getByReference(reference: string): Promise<Ticket | undefined> {
    return readTickets().find(t => t.reference === reference)
  },

  async getById(id: string): Promise<Ticket | undefined> {
    return readTickets().find(t => t.id === id)
  },

  async list(): Promise<Ticket[]> {
    return readTickets()
  },

  async getEvents(ticketId: string): Promise<TicketEvent[]> {
    return readEvents().filter(e => e.ticketId === ticketId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },

  async updateStatus(ticketId: string, to: TicketStatus, actor: User): Promise<Ticket> {
    const tickets = readTickets()
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) throw new Error('Ticket not found')
    if (!canTransition(ticket.status, to)) throw new Error(`Cannot move ticket from ${ticket.status} to ${to}`)
    if (to === 'cancelled' && actor.role !== 'supervisor') throw new Error('Only a supervisor can cancel a ticket')

    const from = ticket.status
    ticket.status = to
    ticket.updatedAt = new Date().toISOString()
    writeTickets(tickets)
    logEvent({ ticketId, type: 'status_changed', actorId: actor.id, fromStatus: from, toStatus: to, createdAt: ticket.updatedAt })
    return ticket
  },

  async assign(ticketId: string, assigneeId: string, actor: User): Promise<Ticket> {
    const tickets = readTickets()
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) throw new Error('Ticket not found')
    ticket.assigneeId = assigneeId
    ticket.updatedAt = new Date().toISOString()
    writeTickets(tickets)
    logEvent({ ticketId, type: 'assigned', actorId: actor.id, createdAt: ticket.updatedAt })
    return ticket
  },

  async respond(ticketId: string, message: string, isInternal: boolean, actor: User): Promise<TicketEvent> {
    const tickets = readTickets()
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) throw new Error('Ticket not found')
    const now = new Date().toISOString()
    ticket.updatedAt = now
    writeTickets(tickets)
    const event: TicketEvent = { id: crypto.randomUUID(), ticketId, type: isInternal ? 'responded_internal' : 'responded_public', actorId: actor.id, message, createdAt: now }
    const events = readEvents()
    events.push(event)
    writeEvents(events)
    return event
  },
  
}