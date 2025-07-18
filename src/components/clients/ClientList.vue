<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Liste des clients</h2>
      <AppButton variant="primary" @click="$emit('add-client')">
        Ajouter un client
      </AppButton>
    </div>

    <div class="mb-4">
      <AppInput
        id="search"
        placeholder="Rechercher un client..."
        v-model="searchQuery"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ClientCard
        v-for="client in filteredClients"
        :key="client.id"
        :client="client"
        @edit="$emit('edit-client', client)"
        @delete="$emit('delete-client', client.id)"
        @click="$emit('select-client', client.id)"
      />
    </div>

    <p v-if="filteredClients.length === 0" class="text-gray-500 text-center py-8">
      Aucun client trouvé
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ClientCard from './ClientCard.vue'
import AppInput from '../ui/AppInput.vue'
import AppButton from '../ui/AppButton.vue'
import type { Client } from '@/models/client'

const props = defineProps({
  clients: {
    type: Array as () => Client[],
    required: true
  }
})

const emit = defineEmits([
  'add-client',
  'edit-client',
  'delete-client',
  'select-client'
])

const searchQuery = ref('')

const filteredClients = computed(() => {
  if (!searchQuery.value) return props.clients

  const query = searchQuery.value.toLowerCase()
  return props.clients.filter(
    (client) =>
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      (client.company && client.company.toLowerCase().includes(query)) ||
      (client.phone && client.phone.includes(query))
  )
})
</script>