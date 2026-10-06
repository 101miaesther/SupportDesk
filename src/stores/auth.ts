import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import type { User } from '@/types/domain'
import { authRepository } from '@/data/authRepository'

const SESSION_KEY = 'supportdesk:session'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isRestoring = ref(true)

  async function restoreSession() {
    const storedId = localStorage.getItem(SESSION_KEY)
    currentUser.value = storedId ? (await authRepository.getUserById(storedId)) ?? null : null
    isRestoring.value = false
  }

  async function login(email: string, password: string) {
    const user = await authRepository.login(email, password)
    if (!user) throw new Error('Invalid email or password')
    currentUser.value = user
    localStorage.setItem(SESSION_KEY, user.id)
    return user
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return { currentUser: readonly(currentUser), isRestoring: readonly(isRestoring), restoreSession, login, logout }
})