<script setup lang="ts">
import BtnPrimary from '@/components/Buttons/BtnPrimary.vue'
import BtnSecondary from '@/components/Buttons/BtnSecondary.vue'
import TheTable from '@/components/Table/TheTable.vue'
import { ref } from 'vue'
import useUser, { type IUserForm } from '@/composables/useUser'
import { IconEdit } from '@tabler/icons-vue'
import DialogForm from '@/components/Form/DialogForm.vue'
import type { IUser } from '@/types'
import { useTimeAgo } from '@vueuse/core'
import FieldForm from '@/components/Form/FieldForm.vue'
import { Form } from 'vee-validate'
import toast from '@/utils/toast'
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()
const { data, isLoading, isError, error, mutation } = useUser()
const openModal = ref(false)

const form = ref<IUserForm>({
  id: '',
  role: '',
  status: ''
})

const roles = ['ADMINISTRADOR', 'CAJERO']
const status = ['REGISTRADO', 'ACTIVO', 'INACTIVO']

function editUser(item: IUser) {
  form.value.id = item._id
  form.value.role = item.role
  form.value.status = item.status
  openModal.value = true
}

function update() {
  mutation.mutate(form.value, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario actualizado correctamente')
      openModal.value = false
    }
  })
}
</script>

<template>
  <DialogForm title="Editar" :isOpen="openModal">
    <Form @submit="update" class="flex flex-col gap-4">
      <FieldForm as="select" text="Rol" name="rol" v-model="form.role" rules="required">
        <option value="">Seleccionar rol</option>
        <option v-for="item in roles" :value="item" :key="item">
          {{ item }}
        </option>
      </FieldForm>
      <FieldForm as="select" text="Estado" name="estado" v-model="form.status" rules="required">
        <option value="">Seleccionar estado</option>
        <option v-for="item in status" :value="item" :key="item">
          {{ item }}
        </option>
      </FieldForm>
      <div class="modal-action">
        <BtnSecondary @click="openModal = false">Cancelar</BtnSecondary>
        <BtnPrimary type="submit"> Guardar </BtnPrimary>
      </div>
    </Form>
  </DialogForm>

  <header class="flex items-center justify-between mb-6">
    <span class="font-bold text-2xl">Usuarios</span>
  </header>

  <div v-if="isError" class="alert alert-error">
    {{ error?.message || 'Ocurrió un error al cargar los usuarios' }}
  </div>

  <TheTable v-else>
    <template #header>
      <th>Nombre</th>
      <th>Correo</th>
      <th>Rol</th>
      <th>Estado</th>
      <th>Última actividad</th>
      <th>Acciones</th>
    </template>
    <template #body>
      <tr v-if="isLoading">
        <td colspan="7">
          <span class="loading-table-data"> </span>
        </td>
      </tr>
      <tr v-else-if="!data || !data.length">
        <td colspan="7" class="text-center">No hay usuarios registrados</td>
      </tr>
      <tr v-else v-for="(item, index) in data" :key="index" class="hover:bg-gray-50">
        <td>
          {{ item.name }}
        </td>
        <td>
          {{ item.email }}
        </td>
        <td>
          {{ item.role }}
        </td>
        <td>
          {{ item.status }}
        </td>
        <td>
          <span v-if="item.lastActivity">
            {{ useTimeAgo(item.lastActivity) }}
          </span>
        </td>
        <td>
          <button type="button" @click="editUser(item)">
            <IconEdit size="25" />
          </button>
        </td>
      </tr>
    </template>
  </TheTable>
</template>
