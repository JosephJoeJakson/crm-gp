import { defineStore } from 'pinia';
import type { ClientList, CreateClientListData, UpdateClientListData } from '@/types';

export const useClientListsStore = defineStore('clientLists', {
  state: () => ({
    clientLists: [] as ClientList[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getClientListById: (state) => (id: string) => {
      return state.clientLists.find(list => list.id === id);
    },
  },

  actions: {
    async fetchClientLists() {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.clientLists.length === 0) {
          this.clientLists = [
            {
              id: '1',
              name: 'Active Customers',
              clientIds: ['1', '2'],
              createdAt: new Date('2024-01-01'),
            },
            {
              id: '2',
              name: 'VIP Clients',
              clientIds: ['1'],
              createdAt: new Date('2024-01-05'),
            },
          ];
        }
      } catch (error) {
        this.error = 'Failed to fetch client lists';
      } finally {
        this.loading = false;
      }
    },

    async createClientList(data: CreateClientListData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newClientList: ClientList = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        this.clientLists.push(newClientList);
        return newClientList;
      } catch (error) {
        this.error = 'Failed to create client list';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateClientList(id: string, data: UpdateClientListData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.clientLists.findIndex(list => list.id === id);
        if (index !== -1) {
          this.clientLists[index] = {
            ...this.clientLists[index],
            ...data,
          };
          return this.clientLists[index];
        }
        throw new Error('Client list not found');
      } catch (error) {
        this.error = 'Failed to update client list';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteClientList(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.clientLists.findIndex(list => list.id === id);
        if (index !== -1) {
          this.clientLists.splice(index, 1);
        }
      } catch (error) {
        this.error = 'Failed to delete client list';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});