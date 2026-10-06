import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ticketRepository } from '@/data/ticketRepository'
import type { Ticket, TicketStatus } from '@/types/domain'

const PAGE_SIZE = 10

export function useTicketQueue() {
  const route = useRoute()
  const router = useRouter()

  const allTickets = ref<Ticket[]>([])
  const loading = ref(true)

  async function load() {
    loading.value = true
    allTickets.value = await ticketRepository.list()
    loading.value = false
  }
  load()
  const status = computed(() => (route.query.status as TicketStatus) || undefined)
  const assignee = computed(() => (route.query.assignee as string) || undefined)
  const search = computed(() => (route.query.q as string) || '')
  const page = computed(() => Number(route.query.page ?? 1))

  function updateQuery(patch: Record<string, string | number | undefined>) {
    const query: Record<string, string> = { ...(route.query as Record<string, string>) }
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === '') delete query[key]
      else query[key] = String(value)
    }
    router.push({ query })
  }

  const setStatus = (value: TicketStatus | undefined) => updateQuery({ status: value, page: 1 })
  const setAssignee = (value: string | undefined) => updateQuery({ assignee: value, page: 1 })
  const setSearch = (value: string) => updateQuery({ q: value, page: 1 })
  const setPage = (value: number) => updateQuery({ page: value })

  const filtered = computed(() => {
    let result = allTickets.value
    if (status.value) result = result.filter(t => t.status === status.value)
    if (assignee.value) result = result.filter(t => t.assigneeId === assignee.value)
    if (search.value) {
      const q = search.value.toLowerCase()
      result = result.filter(t => t.subject.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q))
    }
    return result
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
  const pageItems = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filtered.value.slice(start, start + PAGE_SIZE)
  })

  return { loading, pageItems, totalPages, status, assignee, search, page, setStatus, setAssignee, setSearch, setPage }
}