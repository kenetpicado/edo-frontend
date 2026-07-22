<script setup lang="ts">
import { ref } from 'vue'
import BtnPrimary from '@/components/Buttons/BtnPrimary.vue'
import useAuth from '@/composables/useAuth'
import type { IRegisterForm } from '@/types'
import { Form } from 'vee-validate'
import FieldForm from '@/components/Form/FieldForm.vue'

const defaultValues: IRegisterForm = {
  name: '',
  email: '',
  password: ''
}

const form = ref<IRegisterForm>({ ...defaultValues })
const showPassword = ref<boolean>(false)

const { register, processing } = useAuth()
const done = ref<boolean>(false)
const title = ref<string>('Crear nueva cuenta')

function onRegister() {
  register(form.value, () => {
    form.value = defaultValues
    done.value = true
    title.value = '¡Su registro se ha realizado correctamente!'
  })
}
</script>

<template>
  <div class="flex flex-col justify-center items-center mb-4">
    <img src="/logo-blue.png" alt="Logo" class="w-auto h-[4rem] mx-auto" />
  </div>

  <div v-if="done" class="text-base">
    Para activar su cuenta, por favor, contacte a un administrador. Una vez aprobado, podrá iniciar
    sesión.
  </div>

  <Form v-else @submit="onRegister">
    <div class="flex flex-col gap-4">
      <FieldForm
        text="Nombre completo"
        name="nombre"
        v-model="form.name"
        autofocus
        placeholder="ej. Kenet Picado"
        rules="required"
      />

      <FieldForm
        text="Correo"
        name="correo"
        v-model="form.email"
        type="email"
        placeholder="ej. kenet@gmail.com"
        rules="required|email"
      />

      <FieldForm
        text="Contraseña"
        name="contraseña"
        v-model="form.password"
        rules="required|password"
        placeholder="********"
        :type="showPassword ? 'text' : 'password'"
      />

      <div class="form-control w-full mb-8">
        <label class="label cursor-pointer">
          <div class="flex gap-2 items-center">
            <input type="checkbox" v-model="showPassword" class="checkbox" />
            <span class="label-text">Mostrar contraseña</span>
          </div>
        </label>
      </div>
    </div>

    <BtnPrimary type="submit" class="w-full" :loading="processing"> Crear cuenta </BtnPrimary>
  </Form>

  <div class="text-center mt-5 text-gray-400">
    ¿Ya tienes cuenta?
    <RouterLink :to="{ name: 'login' }" class="text-neutral"> Inicia sesión </RouterLink>
  </div>
</template>
