<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-yellow-50 to-green-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-green-600">
        Client Lists
      </h1>
      <router-link to="/client-lists/new" class="px-4 py-2 bg-gradient-to-r from-yellow-600 to-green-600 text-white font-bold rounded-lg shadow-md hover:from-yellow-700 hover:to-green-700 transition duration-300">
        Create New List
      </router-link>
    </div>
    <ErrorMessage v-if="clientListsStore.error" :message="clientListsStore.error" />
    <LoadingSpinner v-else-if="clientListsStore.loading" />

    <div v-else class="table-container mt-8">
      <div class="overflow-x-auto bg-white rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-yellow-600 to-green-600">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Clients Count</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="clientList in clientListsStore.clientLists" :key="clientList.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ clientList.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ clientList.clientIds.length }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(clientList.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <router-link :to="`/client-lists/${clientList.id}`" class="px-3 py-1 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    View
                  </router-link>
                  <router-link :to="`/client-lists/${clientList.id}/edit`" class="px-3 py-1 text-white bg-gradient-to-r from-yellow-600 to-green-600 rounded-lg shadow-sm hover:from-yellow-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    Edit
                  </router-link>
                  <button @click="deleteClientList(clientList.id)" class="px-3 py-1 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500">
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
import { useClientListsStore } from '@/stores/clientLists';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const clientListsStore = useClientListsStore();

onMounted(() => {
  clientListsStore.fetchClientLists();
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

const deleteClientList = async (id: string) => {
  if (confirm('Are you sure you want to delete this client list?')) {
    await clientListsStore.deleteClientList(id);
  }
};
</script>
