import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Client, ClientFormData, Note, Reminder } from '@/models/client'

export const useClientStore = defineStore('client', () => {
  const clients = ref<Client[]>([])

  // Initialisation avec quelques données de démo
  if (clients.value.length === 0) {
    clients.value = [
      {
        id: uuidv4(),
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        phone: '0123456789',
        company: 'Dupont SA',
        notes: [
          {
            id: uuidv4(),
            content: 'Intéressé par notre nouvelle gamme de produits',
            createdAt: new Date()
          }
        ],
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  function addClient(clientData: ClientFormData) {
    const newClient: Client = {
      id: uuidv4(),
      ...clientData,
      notes: [],
      reminders: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    clients.value.push(newClient)
    return newClient
  }

  function updateClient(id: string, clientData: Partial<ClientFormData>) {
    const clientIndex = clients.value.findIndex(c => c.id === id)
    if (clientIndex !== -1) {
      clients.value[clientIndex] = {
        ...clients.value[clientIndex],
        ...clientData,
        updatedAt: new Date()
      }
      return clients.value[clientIndex]
    }
    return null
  }

  function deleteClient(id: string) {
    clients.value = clients.value.filter(c => c.id !== id)
  }

  function getClientById(id: string) {
    return clients.value.find(c => c.id === id) || null
  }

  function addNoteToClient(clientId: string, content: string) {
    const client = getClientById(clientId)
    if (client) {
      const newNote = {
        id: uuidv4(),
        content,
        createdAt: new Date()
      }
      client.notes.push(newNote)
      client.updatedAt = new Date()
      return newNote
    }
    return null
  }

  function addReminderToClient(clientId: string, title: string, date: Date) {
    const client = getClientById(clientId)
    if (client) {
      const newReminder = {
        id: uuidv4(),
        title,
        date,
        completed: false
      }
      client.reminders.push(newReminder)
      client.updatedAt = new Date()
      return newReminder
    }
    return null
  }

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    addNoteToClient,
    addReminderToClient
  }
})