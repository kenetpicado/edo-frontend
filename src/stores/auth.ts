import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from '@/types'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const auth = ref<IUser>()

    function getAuth() {
      return auth.value
    }

    function clearData() {
      auth.value = undefined
    }

    function hasRoles(names: Array<string>) {
      if (auth.value && auth.value) {
        return names.includes(auth.value.role)
      }

      return false
    }

    function getCurrentRole(): string {
      return auth.value?.role || ''
    }

    function canShowThisItem(route: object) {
      const authorizedRoles = (useRouter().resolve(route).meta?.roles as string[]) || []
      return authorizedRoles.includes(getCurrentRole())
    }

    return { auth, getAuth, hasRoles, clearData, getCurrentRole, canShowThisItem }
  },
  {
    persist: true
  }
)
