<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-yellow-50 to-green-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-green-600">
        Client List Details
      </h1>
      <div class="flex space-x-4">
        <router-link :to="`/client-lists/${clientList?.id}/edit`" class="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-green-600 text-white font-bold rounded-lg shadow-md hover:from-yellow-700 hover:to-green-700 transition duration-300">
          Edit List
        </router-link>
        <router-link to="/client-lists" class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
          Back to List
        </router-link>
      </div>
    </div>
    <ErrorMessage v-if="clientListsStore.error" :message="clientListsStore.error" />
    <LoadingSpinner v-else-if="clientListsStore.loading" />

    <div v-else-if="clientList" class="space-y-6">
      <!-- List Information -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">List Information</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="text-sm text-gray-900">{{ clientList.name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Clients Count</dt>
                <dd class="text-sm text-gray-900">{{ clientList.clientIds.length }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Created</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(clientList.createdAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <!-- Clients in List -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Clients in this List</h3>
        <div v-if="clientsInList.length > 0" class="table-container">
          <div class="overflow-x-auto bg-white rounded-lg shadow-md">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-yellow-600 to-green-600">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="client in clientsInList" :key="client.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ client.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getStatusClass(client.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ client.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.email || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.phone || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <router-link :to="`/clients/${client.id}`" class="px-3 py-1 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                      View
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          No clients in this list.
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-gray-500">Client list not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClientListsStore } from '@/stores/clientLists';
import { useClientsStore } from '@/stores/clients';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();
const clientListsStore = useClientListsStore();
const clientsStore = useClientsStore();

const clientList = computed(() => {
  const id = route.params.id as string;
  return clientListsStore.getClientListById(id);
});

const clientsInList = computed(() => {
  if (!clientList.value) return [];
  return clientList.value.clientIds
    .map(id => clientsStore.getClientById(id))
    .filter(client => client !== undefined);
});

onMounted(() => {
  if (clientListsStore.clientLists.length === 0) {
    clientListsStore.fetchClientLists();
  }
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

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};
</script>
