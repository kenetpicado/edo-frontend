<script setup lang="ts">
import { ref } from 'vue'
import BtnPrimary from '@/components/Buttons/BtnPrimary.vue'
import useAuth from '@/composables/useAuth.js'
import type { ILoginForm } from '@/types'
import { Form } from 'vee-validate'
import FieldForm from '@/components/Form/FieldForm.vue'

const { login, processing } = useAuth()

const form = ref<ILoginForm>({
  email: '',
  password: ''
})
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <img src="/logo-blue.png" alt="Logo" class="w-auto h-[4rem] mx-auto" />
  </div>

  <Form @submit="login(form)" class="mb-6">
    <div class="flex flex-col gap-4">
      <FieldForm
        text="Correo"
        name="correo"
        v-model="form.email"
        autofocus
        type="email"
        rules="required|email"
        placeholder="ej. example@gmail.com"
      />

      <FieldForm
        text="Contraseña"
        name="contraseña"
        v-model="form.password"
        rules="required"
        type="password"
        placeholder="********"
      />

      <BtnPrimary type="submit" class="mt-4 w-full" :loading="processing"> Ingresar </BtnPrimary>
    </div>
  </Form>

  <div class="text-center text-gray-400">
    ¿No tienes cuenta?
    <RouterLink :to="{ name: 'register' }" class="text-neutral"> Registrarme </RouterLink>
  </div>
</template>
