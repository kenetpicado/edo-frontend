import type { IPackage, IMailPackage } from '@/types'
import { usePackageStore } from '@/stores/package'
import api from '@/config/axios'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import cleanQueryParams from '@/utils/query-params'
import toast from '@/utils/toast'
import useCrud from '@/composables/useCrud'
import useForm from '@/composables/useForm'

export default function usePackage() {
  const { packages, mailPackages, meta } = storeToRefs(usePackageStore())
  const { index, processing, update, store, request } = useCrud('/packages')
  const openModal = ref<boolean>(false)

  const queryParams = ref<any>({
    type: '',
    client: '',
    guide: '',
    status: '',
    entryDate: '',
    tracking: ''
  })

  const { form, reset } = useForm<IPackage>({
    id: '',
    guide: '',
    client: '',
    description: '',
    pieces: 0,
    grossWeight: 0,
    entryDate: '',
    tracking: ''
  })

  async function getPackages() {
    const params = {
      page: meta.value.page,
      ...cleanQueryParams(queryParams.value)
    }

    await index(params).then((response) => {
      const { docs, ...rest } = response.data
      packages.value = docs
      meta.value = rest
    })
  }

  function getMailPackages() {
    const params = {
      page: meta.value.page,
      ...cleanQueryParams(queryParams.value)
    }

    request({
      method: 'get',
      url: '/packages/mail',
      params
    }).then((response) => {
      const { docs, ...rest } = response.data
      mailPackages.value = docs as IMailPackage[]
      meta.value = rest
    })

    /*api
      .get('show', { params })
      .then((response) => {
        mailPackages.value = response.data as IMailPackageResponse
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        processing.value = false
      })*/
  }

  function updatePackage() {
    update(form.value.id as string, form.value).then(() => {
      onSuccess()
    })
  }

  async function storePackage() {
    await store(form.value).then(() => {
      onSuccess()
    })
  }

  function onSuccess() {
    openModal.value = false
    document.getElementById('resetPackage')?.click()
    reset()
    getPackages()
  }

  function bulkPackages(data: IMailPackage[], messageIds: string[], callback: () => void) {
    processing.value = true

    api
      .post('/bulk-packages', {
        packages: data,
        messages: messageIds
      })
      .then(() => {
        toast.success('Paquetes guardados correctamente')
        callback()
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Error al guardar los paquetes')
      })
      .finally(() => {
        processing.value = false
      })
  }

  return {
    getPackages,
    packages,
    processing,
    queryParams,
    updatePackage,
    storePackage,
    bulkPackages,
    getMailPackages,
    mailPackages,
    meta,
    form,
    reset,
    openModal
  }
}
