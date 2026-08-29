<template>
  <header class="flex items-center justify-between mb-6">
    <span class="font-bold text-2xl">Paquetes</span>
    <BtnPrimary @click="createPackage"> Nuevo </BtnPrimary>
  </header>

  <DialogForm :title="isEdit ? 'Editar Paquete' : 'Nuevo Paquete'" :isOpen="openModal">
    <Form @submit="onSubmit" class="flex flex-col gap-4">
      <FieldForm
        text="Tracking"
        name="tracking"
        v-model="form.tracking"
        placeholder="ej. GFUS01067162223171"
      />

      <FieldForm
        text="Cliente"
        name="cliente"
        v-model="form.client"
        rules="required"
        placeholder="ej. Kenet Picado"
      />

      <FieldForm
        text="Descripción"
        name="descripción"
        v-model="form.description"
        rules="required"
        placeholder="ej. Paquete de libros"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FieldForm
          text="Guía"
          name="guia"
          v-model="form.guide"
          rules="required"
          placeholder="ej. REI-3736"
        />

        <FieldForm
          text="Piezas"
          name="piezas"
          v-model="form.pieces"
          type="number"
          rules="required|min_value:1"
          placeholder="ej. 1"
        />

        <FieldForm
          text="Peso (lbs)"
          name="peso"
          v-model="form.grossWeight"
          type="number"
          rules="required"
          placeholder="ej. 5"
        />

        <FieldForm
          text="Ingreso"
          name="entryDate"
          v-model="form.entryDate"
          type="date"
          rules="required"
        />

        <FieldForm as="select" text="Tipo" name="tipo" v-model="form.type" rules="required">
          <option value="">Selecciona un tipo</option>
          <option v-for="price in prices" :value="price.type" :key="price.id">
            {{ price.type }}
          </option>
        </FieldForm>
      </div>

      <div class="modal-action">
        <BtnSecondary type="reset" id="resetPackage" @click="onCancel">Cancelar</BtnSecondary>
        <BtnPrimary type="submit" :loading="processing">
          {{ isEdit ? 'Actualizar' : 'Guardar' }}
        </BtnPrimary>
      </div>
    </Form>
  </DialogForm>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <FieldForm
      text="Guía"
      name="guide"
      v-model="queryParams.guide"
      placeholder="Número de guia"
      type="number"
    />

    <FieldForm
      text="Cliente"
      name="client"
      v-model="queryParams.client"
      placeholder="Nombre del cliente"
      type="search"
    />

    <FieldForm as="select" text="Tipo" name="type" v-model="queryParams.type">
      <option value="">Todos</option>
      <option v-for="price in prices" :value="price.type" :key="price.id">{{ price.type }}</option>
    </FieldForm>

    <FieldForm as="select" text="Estado" name="status" v-model="queryParams.status">
      <option value="">Todos</option>
      <option v-for="item in status" :value="item" :key="item">{{ item }}</option>
    </FieldForm>

    <FieldForm text="Ingreso" name="entryDate" v-model="queryParams.entryDate" type="date" />
  </div>

  <TheTable>
    <template #header>
      <th>Creado</th>
      <th>Ingreso</th>
      <th>Guia</th>
      <th>Tipo</th>
      <th>Peso</th>
      <th>Piezas</th>
      <th>Estado</th>
      <th>Cliente</th>
      <th>Descripción</th>
      <th>Acciones</th>
    </template>
    <template #body>
      <tr v-if="processing">
        <td colspan="10">
          <span class="loading-table-data"> </span>
        </td>
      </tr>
      <tr v-else-if="!packages.length">
        <td colspan="10" class="text-center">No hay paquetes</td>
      </tr>
      <tr v-else v-for="(item, index) in packages" :key="index" class="hover:bg-gray-50">
        <td>
          <span v-if="item.createdAt">
            {{ format(item.createdAt, { date: 'short', time: 'short' }) }}
          </span>
        </td>
        <td>
          <span v-if="item.entryDate">
            {{ format(item.entryDate, 'short') }}
          </span>
        </td>
        <td>
          {{ item.guide }}
        </td>
        <td>
          {{ item.type }}
        </td>
        <td>{{ item.grossWeight }} lb(s)</td>
        <td>
          {{ item.pieces }}
        </td>
        <td>
          <RouterLink
            class="text-primary underline"
            v-if="item.billing"
            :to="{ name: 'billing.show', params: { id: item.billing } }"
          >
            {{ item.status }}
          </RouterLink>
          <span v-else class="text-gray-400">
            {{ item.status }}
          </span>
        </td>
        <td>
          {{ item.client }}
        </td>
        <td>
          {{ item.description }}
        </td>
        <td>
          <button type="button" @click="editPackage(item)">
            <IconEdit size="25" />
          </button>
        </td>
      </tr>
    </template>
  </TheTable>

  <ThePaginate v-model="meta.page" :meta="meta" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import usePackage from '@/composables/usePackage'
import { watchDebounced } from '@vueuse/core'
import status from '@/utils/status'
import usePrice from '@/composables/usePrice'
import { IconEdit } from '@tabler/icons-vue'
import type { IPackage } from '@/types'
import BtnSecondary from '@/components/Buttons/BtnSecondary.vue'
import BtnPrimary from '@/components/Buttons/BtnPrimary.vue'
import DialogForm from '@/components/Form/DialogForm.vue'
import TheTable from '@/components/Table/TheTable.vue'
import ThePaginate from '@/components/ThePaginate.vue'
import { format } from '@formkit/tempo'
import FieldForm from '@/components/Form/FieldForm.vue'
import { Form } from 'vee-validate'

const {
  getPackages,
  packages,
  queryParams,
  processing,
  updatePackage,
  storePackage,
  meta,
  form,
  openModal,
  reset
} = usePackage()
const { prices, getPrices } = usePrice()

const isEdit = ref<boolean>(false)

onMounted(() => {
  getPackages()
  getPrices()
})

function createPackage() {
  reset()
  form.value.entryDate = format(new Date(), 'YYYY-MM-DD')
  isEdit.value = false
  openModal.value = true
}

function editPackage(item: IPackage) {
  form.value.id = item.id
  form.value.guide = item.guide
  form.value.client = item.client
  form.value.description = item.description
  form.value.pieces = item.pieces
  form.value.grossWeight = item.grossWeight
  form.value.tracking = item.tracking
  form.value.entryDate = item.entryDate
  form.value.type = item.type
  isEdit.value = true
  openModal.value = true
}

function onCancel() {
  reset()
  isEdit.value = false
  openModal.value = false
}

function onSubmit() {
  if (isEdit.value && form.value.id) {
    updatePackage()
  } else {
    storePackage()
  }
}

watchDebounced(
  queryParams.value,
  () => {
    meta.value.page = 1
    getPackages()
  },
  { debounce: 500, maxWait: 1000 }
)

watch(
  () => meta.value.page,
  () => {
    getPackages()
  }
)
</script>
