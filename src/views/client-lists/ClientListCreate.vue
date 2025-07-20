<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-yellow-50 to-green-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-green-600">
        Create New Client List
      </h1>
      <router-link to="/client-lists" class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
        Back to List
      </router-link>
    </div>
    <ErrorMessage v-if="clientListsStore.error" :message="clientListsStore.error" />
    <div class="bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">List Name *</label>
          <input type="text" id="name" v-model="form.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Select Clients</label>
          <div class="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4">
            <label v-for="client in clientsStore.clients" :key="client.id" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <input type="checkbox" :value="client.id" v-model="form.clientIds" class="rounded border-gray-300 text-yellow-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ client.name }}</div>
                <div class="text-sm text-gray-500">{{ client.email || 'No email' }}</div>
              </div>
              <span :class="getStatusClass(client.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ client.status }}
              </span>
            </label>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Selected: {{ form.clientIds.length }} client(s)
          </p>
        </div>
        <div class="flex justify-end space-x-4">
          <router-link to="/client-lists" class="px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            Cancel
          </router-link>
          <button type="submit" class="px-4 py-2 bg-gradient-to-r from-yellow-600 to-green-600 text-white font-bold rounded-lg shadow-md hover:from-yellow-700 hover:to-green-700 transition duration-300" :disabled="clientListsStore.loading">
            {{ clientListsStore.loading ? 'Creating...' : 'Create List' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useClientListsStore } from '@/stores/clientLists';
import { useClientsStore } from '@/stores/clients';
import ErrorMessage from '@/components/ErrorMessage.vue';
import type { CreateClientListData } from '@/types';

const router = useRouter();
const clientListsStore = useClientListsStore();
const clientsStore = useClientsStore();

const form = reactive<CreateClientListData>({
  name: '',
  clientIds: [],
});

onMounted(() => {
  if (clientsStore.clients.length === 0) {
    clientsStore.fetchClients();
  }
});

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Actif':
      return 'bg-green-100 text-green-800';
    case 'Prospect':
      return 'bg-yellow-100 text-yellow-800';
    case 'Inactif':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const handleSubmit = async () => {
  try {
    await clientListsStore.createClientList(form);
    router.push('/client-lists');
  } catch (error) {
    console.error('Failed to create client list:', error);
  }
};
</script>
