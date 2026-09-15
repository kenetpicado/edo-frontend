import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IEmail } from '@/types'

export interface IEmailResponse {
  data: IEmail[]
  nextPageToken?: string
}

export const useGoogleStore = defineStore('google_store', () => {
  const authRoute = ref<string>('')

  const emails = ref<IEmailResponse>({
    data: [],
    nextPageToken: ''
  })

  return { authRoute, emails }
})
