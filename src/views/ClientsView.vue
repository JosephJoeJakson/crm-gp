<template>
  <div class="container mx-auto px-4 py-6">
    <AppAlert
      v-if="showSuccessAlert"
      type="success"
      @close="showSuccessAlert = false"
    >
      Le client a été supprimé avec succès
    </AppAlert>

    <ClientList
      :clients="clients"
      @add-client="showAddModal = true"
      @edit-client="editClient"
      @delete-client="confirmDeleteClient"
      @select-client="navigateToClient"
    />

    <!-- Modal d'ajout/modification -->
    <div
      v-if="showAddModal || currentClient"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ currentClient ? 'Modifier le client' : 'Ajouter un client' }}
        </h2>
        <ClientForm
          :initial-data="currentClient || undefined"
          :submit-text="currentClient ? 'Mettre à jour' : 'Ajouter'"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div
      v-if="clientToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p class="mb-6">
          Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
        </p>
        <div class="flex justify-end space-x-3">
          <AppButton variant="secondary" @click="clientToDelete = null">
            Annuler
          </AppButton>
          <AppButton variant="danger" @click="deleteClient">
            Supprimer
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/client'
import type { Client, ClientFormData } from '@/models/client'
import ClientList from '@/components/clients/ClientList.vue'
import ClientForm from '@/components/clients/ClientForm.vue'
import AppAlert from '@/components/ui/AppAlert.vue'
import AppButton from '@/components/ui/AppButton.vue'

const clientStore = useClientStore()
const router = useRouter()

const clients = computed(() => clientStore.clients)

const showAddModal = ref(false)
const currentClient = ref<ClientFormData | null>(null)
const clientToDelete = ref<string | null>(null)
const showSuccessAlert = ref(false)

function editClient(client: Client) {
  currentClient.value = {
    name: client.name,
    email: client.email,
    phone: client.phone || '',
    company: client.company || '',
    address: client.address || ''
  }
}

function confirmDeleteClient(clientId: string) {
  clientToDelete.value = clientId
}

async function deleteClient() {
  if (clientToDelete.value) {
    clientStore.deleteClient(clientToDelete.value)
    clientToDelete.value = null
    showSuccessAlert.value = true
  }
}

function handleSubmit(formData: ClientFormData) {
  if (currentClient.value) {
    // Modification
    // Ici on devrait avoir l'ID du client à modifier
    // Pour simplifier, on ne gère pas la modification dans cet exemple
  } else {
    // Ajout
    clientStore.addClient(formData)
  }
  closeModal()
}

function closeModal() {
  showAddModal.value = false
  currentClient.value = null
}

function navigateToClient(clientId: string) {
  router.push({ name: 'client-detail', params: { id: clientId } })
}
</script>