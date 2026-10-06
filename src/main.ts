import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from '@/stores/auth'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.restoreSession().then(() => {
  app.mount('#app')
})
