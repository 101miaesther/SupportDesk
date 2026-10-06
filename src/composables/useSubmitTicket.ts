import { reactive, ref } from 'vue'
import { ticketRepository, type CreateTicketInput } from '@/data/ticketRepository'
import type { Ticket } from '@/types/domain'

//logic sits here
export function useSubmitTicket() {
  const form = reactive<CreateTicketInput>({
    name: '',
    email: '',
    category: 'technical',
    subject: '',
    description: '',
  })

  const submitting = ref(false)
  const error = ref<string | null>(null)
  const createdTicket = ref<Ticket | null>(null)

  async function submit() {
    submitting.value = true
    error.value = null
    try {
      createdTicket.value = await ticketRepository.create({ ...form })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong'
    } finally {
      submitting.value = false
    }
  }

  return { form, submitting, error, createdTicket, submit }
}