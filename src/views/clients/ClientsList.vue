<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
        Clients
      </h1>
      <router-link
        to="/clients/new"
        class="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg shadow-md hover:from-red-700 hover:to-orange-700 transition duration-300"
      >
        Add New Client
      </router-link>
    </div>
    <ErrorMessage v-if="clientsStore.error" :message="clientsStore.error" />
    <LoadingSpinner v-else-if="clientsStore.loading" />
    <div v-else class="table-container mt-8">
      <div class="overflow-x-auto bg-white rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-red-600 to-orange-600">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in clientsStore.clients" :key="client.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ client.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="getStatusClass(client.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ client.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.email || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.phone || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(client.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <router-link
                    :to="`/clients/${client.id}`"
                    class="px-3 py-1 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    View
                  </router-link>
                  <router-link
                    :to="`/clients/${client.id}/edit`"
                    class="px-3 py-1 text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-sm hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteClient(client.id)"
                    class="px-3 py-1 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useClientsStore } from '@/stores/clients';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const clientsStore = useClientsStore();

onMounted(() => {
  clientsStore.fetchClients();
});

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Actif':
      return 'bg-green-200 text-green-800';
    case 'Prospect':
      return 'bg-blue-200 text-blue-800';
    case 'Inactif':
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

const deleteClient = async (id: string) => {
  if (confirm('Are you sure you want to delete this client?')) {
    await clientsStore.deleteClient(id);
  }
};
</script>
