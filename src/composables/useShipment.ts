import type { IShipment } from '@/types'
import { useShipmentStore } from '@/stores/shipment'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import api from '@/config/axios'
import toast from '@/utils/toast'
import processError from '@/utils/process-error'
import { useRouter } from 'vue-router'

export default function useShipment() {
  const { shipments, shipment, meta } = storeToRefs(useShipmentStore())
  const processing = ref<boolean>(false)
  const openModal = ref<boolean>(false)
  const router = useRouter()

  async function getShipments() {
    processing.value = true

    const params = {
      page: meta.value.page
    }

    try {
      const response = await api.get('/shipments', { params })
      const { docs, ...rest } = response.data
      shipments.value = docs
      meta.value = rest
    } catch (err) {
      processError(err)
    } finally {
      processing.value = false
    }
  }

  async function getShipment(id: string) {
    processing.value = true
    shipment.value = undefined

    try {
      const response = await api.get('/shipments/' + id)
      shipment.value = response.data
    } catch (err) {
      processError(err)
    } finally {
      processing.value = false
    }
  }

  async function storeShipment(body: IShipment) {
    processing.value = true

    try {
      const { data } = await api.post('/shipments', body)
      toast.success('Creado correctamente')

      if (data._id) {
        router.push({ name: 'shipments.show', params: { id: data._id } })
      }
    } catch (err) {
      processError(err)
    } finally {
      processing.value = false
    }
  }

  async function updateShipment(body: IShipment) {
    processing.value = true

    try {
      await api.put('/shipments/' + body.id, body)
      toast.success('Actualizado correctamente')
      router.push({ name: 'shipments.show', params: { id: body.id } })
    } catch (err) {
      processError(err)
    } finally {
      processing.value = false
    }
  }

  async function deleteShipment(id: string) {
    processing.value = true

    try {
      await api.delete('/shipments/' + id)
      toast.success('Eliminado correctamente')
      getShipments()
    } catch (err) {
      processError(err)
    } finally {
      processing.value = false
    }
  }

  return {
    getShipments,
    getShipment,
    shipments,
    shipment,
    processing,
    storeShipment,
    updateShipment,
    deleteShipment,
    meta,
    openModal
  }
}
