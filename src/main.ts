import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createNotivue } from 'notivue'

import 'notivue/notification.css'
import 'notivue/animations.css'

import App from './App.vue'
import router from './router'

import print from 'vue3-print-nb'
import './config/vee-validate'

const queryClient = new QueryClient()
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const notivue = createNotivue({
  position: 'bottom-right',
  limit: 2,
  pauseOnHover: false,
  notifications: {
    global: {
      duration: 3000
    }
  }
})

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(print)
app.use(VueQueryPlugin, { queryClient })
app.use(notivue)

app.mount('#app')
