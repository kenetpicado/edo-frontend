<template>
  <loading v-model:active="isLoading" color="#2563eb" loader="dots" />

  <Form @submit="onSubmit">
    <header class="flex items-center justify-between mb-8">
      <span class="font-bold text-2xl">Nuevo</span>
      <BtnSecondary @click="open">
        <IconUpload size="20" />
        Subir archivo
      </BtnSecondary>
    </header>

    <div v-if="errorMessage" role="alert" class="alert alert-error mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        No se pudo procesar tu archivo ya que tiene errores, por favor, revisa y vuelve a
        intentarlo.
        <br />
        {{ errorMessage }}
      </span>
    </div>

    <TheTable>
      <template #header>
        <th>#</th>
        <th>Guia</th>
        <th>Descripción</th>
        <th>Piezas</th>
        <th>Peso (lbs)</th>
        <th>Cliente</th>
        <th>Tipo</th>
        <th>Ingreso</th>
      </template>
      <template #body>
        <tr v-if="!form.packages.length">
          <td colspan="7" class="text-center">No hay datos que mostrar</td>
        </tr>
        <tr v-else v-for="(item, index) in form.packages" :key="index" class="hover:bg-gray-50">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ item.guide }}
          </td>
          <td class="truncate max-w-[5rem]">
            {{ item.description }}
          </td>
          <td>
            {{ item.pieces }}
          </td>
          <td>
            <input
              type="number"
              class="input w-full input-bordered input-sm"
              v-model="item.grossWeight"
            />
          </td>
          <td>
            <input type="text" class="input w-full input-bordered input-sm" v-model="item.client" />
          </td>
          <td>
            {{ item.service }}
          </td>
          <td>
            {{ item.entryDate }}
          </td>
        </tr>
      </template>
    </TheTable>

    <div class="grid grid-cols-4 gap-4 mt-6">
      <FieldForm
        text="Total"
        name="total"
        v-model="form.total"
        type="number"
        rules="required|min_value:1"
        placeholder="ej. 200"
      />

      <FieldForm
        text="Código o referencia"
        name="referencia"
        v-model="form.code"
        rules="required"
        placeholder="ej. REF12345"
      />

      <FieldForm as="select" text="Tipo de lote" name="tipo" v-model="form.type" rules="required">
        <option value="">Selecciona un tipo</option>
        <option v-for="price in prices" :value="price.type" :key="price.id">
          {{ price.type }}
        </option>
      </FieldForm>
    </div>

    <div class="flex justify-end gap-4">
      <BtnPrimary type="submit" :loading="processing" :disabled="!form.packages.length">
        Guardar
      </BtnPrimary>
    </div>
  </Form>
</template>

<script setup lang="ts">
import BtnPrimary from '@/components/Buttons/BtnPrimary.vue'
import BtnSecondary from '@/components/Buttons/BtnSecondary.vue'
import { onMounted, ref } from 'vue'
import TheTable from '@/components/Table/TheTable.vue'
import { IconUpload } from '@tabler/icons-vue'
import toast from '@/utils/toast'
import type { IBatch, IPackage } from '@/types'
import useBatch from '@/composables/useBatch'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import * as XLSX from 'xlsx'
import usePrice from '@/composables/usePrice'
import { format } from '@formkit/tempo'
import { useFileDialog } from '@vueuse/core'
import { Form } from 'vee-validate'
import FieldForm from '@/components/Form/FieldForm.vue'

const isLoading = ref<boolean>(false)

const { storeBatch, processing } = useBatch()
const { prices, getPrices } = usePrice()

const errorMessage = ref<string>('')

const form = ref<IBatch>({
  total: 0,
  type: '',
  packages: [],
  code: ''
})

const { open, onChange } = useFileDialog({
  accept:
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
  directory: false
})

onMounted(() => {
  getPrices()
})

onChange((files: any) => {
  errorMessage.value = ''
  isLoading.value = true

  if (!files.length) {
    isLoading.value = false
    form.value.packages = []
    return
  }

  processFile(files[0])
    .then((packages: any) => {
      form.value.packages = packages as IPackage[]
    })
    .catch((error: any) => {
      errorMessage.value = error.message
    })
    .finally(() => {
      isLoading.value = false
    })
})

function onSubmit() {
  if (!form.value.type) {
    toast.error('El tipo es requerido')
    return
  }

  storeBatch(form.value, () => {
    form.value.total = 0
    form.value.type = ''
    form.value.packages = []
  })
}

function processFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

        const headerRowIndex = rows.findIndex((row) => row[0] === 'Entry Number')

        if (headerRowIndex === -1) {
          throw new Error('No se encontró la fila de encabezados en el archivo.')
        }

        const dataRows = rows.slice(headerRowIndex + 1)

        const packages = dataRows
          .filter((row) => typeof row[0] === 'string' && row[0].startsWith('REI-'))
          .map((row) => ({
            guide: row[0],
            description: String(row[14] ?? ''),
            pieces: Number(row[19]) || 0,
            grossWeight: Number(row[18]) || 0,
            client: String(row[9] ?? ''),
            entryDate: row[1] ? formatDate(row[1]) : '',
            tracking: String(row[7] ?? ''),
            carrier: String(row[8] ?? ''),
            service: getType(String(row[11] ?? ''))
          }))

        resolve(packages)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => reject(error)

    reader.readAsArrayBuffer(file)
  })
}

function formatDate(date: any): string {
  return format(new Date(date), 'YYYY-MM-DD')
}

function getType(value?: string) {
  if (value === 'Ocean') {
    return 'MARITIMO'
  }

  if (value === 'Air') {
    return 'AEREO'
  }

  return 'No reconocido'
}
</script>
