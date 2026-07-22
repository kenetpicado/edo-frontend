import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IShipment, IMeta } from '@/types'
import { defaultMeta } from '@/defaults'

export const useShipmentStore = defineStore('shipment', () => {
  const shipments = ref<IShipment[]>([])
  const shipment = ref<IShipment>()
  const meta = ref<IMeta>({ ...defaultMeta })

  return { shipments, shipment, meta }
})
