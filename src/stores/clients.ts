import { defineStore } from 'pinia';
import type { Client, CreateClientData, UpdateClientData } from '@/types';

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [] as Client[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getClientById: (state) => (id: string) => {
      return state.clients.find(client => client.id === id);
    },
    activeClients: (state) => {
      return state.clients.filter(client => client.status === 'Actif');
    },
  },

  actions: {
    async fetchClients() {
      this.loading = true;
      this.error = null;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock data
        if (this.clients.length === 0) {
          this.clients = [
            {
              id: '1',
              name: 'Acme Corp',
              status: 'Actif',
              email: 'contact@acme.com',
              phone: '+33123456789',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '2',
              name: 'Tech Solutions',
              status: 'Prospect',
              email: 'info@techsolutions.com',
              createdAt: new Date('2024-01-02'),
              updatedAt: new Date('2024-01-02'),
            },
            {
              id: '3',
              name: 'Global Industries',
              status: 'Inactif',
              email: 'hello@global.com',
              phone: '+33987654321',
              createdAt: new Date('2024-01-03'),
              updatedAt: new Date('2024-01-03'),
            },
          ];
        }
      } catch (error) {
        this.error = 'Failed to fetch clients';
      } finally {
        this.loading = false;
      }
    },

    async createClient(data: CreateClientData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newClient: Client = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.clients.push(newClient);
        return newClient;
      } catch (error) {
        this.error = 'Failed to create client';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateClient(id: string, data: UpdateClientData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.clients.findIndex(client => client.id === id);
        if (index !== -1) {
          this.clients[index] = {
            ...this.clients[index],
            ...data,
            updatedAt: new Date(),
          };
          return this.clients[index];
        }
        throw new Error('Client not found');
      } catch (error) {
        this.error = 'Failed to update client';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteClient(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.clients.findIndex(client => client.id === id);
        if (index !== -1) {
          this.clients.splice(index, 1);
        }
      } catch (error) {
        this.error = 'Failed to delete client';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});