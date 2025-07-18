<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <AppInput
      id="name"
      label="Nom complet"
      v-model="formData.name"
      :error="errors.name"
      required
    />
    <AppInput
      id="email"
      label="Email"
      type="email"
      v-model="formData.email"
      :error="errors.email"
      required
    />
    <AppInput
      id="phone"
      label="Téléphone"
      type="tel"
      v-model="formData.phone"
      :error="errors.phone"
    />
    <AppInput
      id="company"
      label="Entreprise"
      v-model="formData.company"
      :error="errors.company"
    />
    <AppInput
      id="address"
      label="Adresse"
      v-model="formData.address"
      :error="errors.address"
    />
    <div class="flex space-x-2">
      <AppButton type="submit" variant="primary">
        {{ submitText }}
      </AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')">
        Annuler
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import AppInput from '../ui/AppInput.vue'
import AppButton from '../ui/AppButton.vue'
import type { ClientFormData } from '@/models/client'

const props = defineProps({
  initialData: {
    type: Object as () => ClientFormData,
    default: () => ({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: ''
    })
  },
  submitText: {
    type: String,
    default: 'Enregistrer'
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive<ClientFormData>({ ...props.initialData })
const errors = reactive<Record<keyof ClientFormData, string>>({
  name: '',
  email: '',
  phone: '',
  company: '',
  address: ''
})

watch(
  () => props.initialData,
  (newData) => {
    Object.assign(formData, newData)
  },
  { deep: true }
)

function validateForm() {
  let isValid = true

  if (!formData.name.trim()) {
    errors.name = 'Le nom est requis'
    isValid = false
  } else {
    errors.name = ''
  }

  if (!formData.email.trim()) {
    errors.email = "L'email est requis"
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "L'email n'est pas valide"
    isValid = false
  } else {
    errors.email = ''
  }

  return isValid
}

function handleSubmit() {
  if (validateForm()) {
    emit('submit', { ...formData })
  }
}
</script>