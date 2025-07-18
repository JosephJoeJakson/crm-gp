<template>
  <div class="container mx-auto px-4 py-6" v-if="client">
    <div class="mb-6">
      <AppButton variant="secondary" @click="router.go(-1)">
        Retour à la liste
      </AppButton>
    </div>

    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-2xl font-bold">{{ client.name }}</h1>
          <p class="text-gray-600">{{ client.company }}</p>
        </div>
        <AppButton variant="primary" @click="showEditModal = true">
          Modifier
        </AppButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-lg font-semibold mb-3">Informations</h2>
          <div class="space-y-2">
            <p><span class="font-medium">Email:</span> {{ client.email }}</p>
            <p v-if="client.phone">
              <span class="font-medium">Téléphone:</span> {{ client.phone }}
            </p>
            <p v-if="client.address">
              <span class="font-medium">Adresse:</span> {{ client.address }}
            </p>
            <p>
              <span class="font-medium">Date de création:</span>
              {{ formatDate(client.createdAt) }}
            </p>
            <p>
              <span class="font-medium">Dernière mise à jour:</span>
              {{ formatDate(client.updatedAt) }}
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-3">Notes</h2>
          <div class="space-y-3">
            <div
              v-for="note in client.notes"
              :key="note.id"
              class="bg-gray-50 p-3 rounded"
            >
              <p class="text-sm">{{ note.content }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(note.createdAt) }}
              </p>
            </div>

            <div class="mt-4">
              <form @submit.prevent="addNote" class="flex gap-2">
                <AppInput
                  id="new-note"
                  v-model="newNote"
                  placeholder="Ajouter une note..."
                  class="flex-grow"
                />
                <AppButton type="submit" variant="primary"> Ajouter </AppButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Rappels -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Rappels</h2>
      <div class="space-y-3">
        <div
          v-for="reminder in client.reminders"
          :key="reminder.id"
          class="border-l-4 pl-3 py-1"
          :class="{
            'border-blue-500': !reminder.completed,
            'border-green-500': reminder.completed
          }"
        >
          <div class="flex justify-between">
            <div>
              <p class="font-medium">{{ reminder.title }}</p>
              <p class="text-sm text-gray-600">
                {{ formatDate(reminder.date) }}
              </p>
            </div>
            <div>
              <input
                type="checkbox"
                v-model="reminder.completed"
                @change="toggleReminder(reminder)"
                class="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        <div class="mt-4">
          <form @submit.prevent="addReminder" class="space-y-3">
            <AppInput
              id="reminder-title"
              v-model="newReminder.title"
              label="Titre"
              required
            />
            <AppInput
              id="reminder-date"
              v-model="newReminder.date"
              type="datetime-local"
              label="Date et heure"
              required
            />
            <AppButton type="submit" variant="primary"> Ajouter un rappel </AppButton>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Modifier le client</h2>
        <ClientForm
          :initial-data="{
            name: client.name,
            email: client.email,
            phone: client.phone || '',
            company: client.company || '',
            address: client.address || ''
          }"
          submit-text="Mettre à jour"
          @submit="updateClient"
          @cancel="showEditModal = false"
        />
      </div>
    </div>
  </div>

  <div v-else class="container mx-auto px-4 py-6 text-center">
    <p>Client non trouvé</p>
    <AppButton variant="secondary" @click="router.push('/')" class="mt-4">
      Retour à la liste
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientStore } from '@/stores/client'
import type { Client, Reminder } from '@/models/client'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import ClientForm from '@/components/clients/ClientForm.vue'

const route = useRoute()
const router = useRouter()
const clientStore = useClientStore()

const client = computed(() => clientStore.getClientById(route.params.id as string))

const showEditModal = ref(false)
const newNote = ref('')
const newReminder = ref({
  title: '',
  date: ''
})

function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function addNote() {
  if (newNote.value.trim() && client.value) {
    clientStore.addNoteToClient(client.value.id, newNote.value)
    newNote.value = ''
  }
}

function addReminder() {
  if (newReminder.value.title.trim() && newReminder.value.date && client.value) {
    const reminderDate = new Date(newReminder.value.date)
    clientStore.addReminderToClient(client.value.id, newReminder.value.title, reminderDate)
    newReminder.value = { title: '', date: '' }
  }
}

function toggleReminder(reminder: Reminder) {
  // Dans une vraie application, on ferait une mise à jour via l'API
  reminder.completed = !reminder.completed
}

function updateClient(formData: any) {
  if (client.value) {
    clientStore.updateClient(client.value.id, formData)
    showEditModal.value = false
  }
}
</script>