<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
        Client Details
      </h1>
      <div class="flex space-x-4">
        <router-link :to="`/clients/${client?.id}/edit`" class="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg shadow-md hover:from-red-700 hover:to-orange-700 transition duration-300">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Client
        </router-link>
        <router-link to="/clients" class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to List
        </router-link>
      </div>
    </div>
    <ErrorMessage v-if="clientsStore.error" :message="clientsStore.error" />
    <LoadingSpinner v-else-if="clientsStore.loading" />

    <div v-else-if="client" class="bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">Name</dt>
              <dd class="text-base text-gray-900 font-medium">{{ client.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">Status</dt>
              <dd>
                <span :class="getStatusClass(client.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ client.status }}
                </span>
              </dd>
            </div>
            <div v-if="client.email">
              <dt class="text-sm font-medium text-gray-500 mb-1">Email</dt>
              <dd class="text-base text-gray-900">
                <a :href="`mailto:${client.email}`" class="text-orange-600 hover:text-orange-800">{{ client.email }}</a>
              </dd>
            </div>
            <div v-if="client.phone">
              <dt class="text-sm font-medium text-gray-500 mb-1">Phone</dt>
              <dd class="text-base text-gray-900">
                <a :href="`tel:${client.phone}`" class="text-orange-600 hover:text-orange-800">{{ client.phone }}</a>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Metadata</h3>
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">Created</dt>
              <dd class="text-base text-gray-900">{{ formatDate(client.createdAt) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">Last Updated</dt>
              <dd class="text-base text-gray-900">{{ formatDate(client.updatedAt) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-gray-500">Client not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClientsStore } from '@/stores/clients';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();
const clientsStore = useClientsStore();

const client = computed(() => {
  const id = route.params.id as string;
  return clientsStore.getClientById(id);
});

onMounted(() => {
  if (clientsStore.clients.length === 0) {
    clientsStore.fetchClients();
  }
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
</script>
