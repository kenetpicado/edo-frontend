import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

import print from 'vue3-print-nb'
import './config/vee-validate'

const queryClient = new QueryClient()
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(print)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
