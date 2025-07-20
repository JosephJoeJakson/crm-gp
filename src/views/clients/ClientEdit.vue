<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
        Edit Client
      </h1>
      <router-link to="/clients" class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to List
      </router-link>
    </div>
    <ErrorMessage v-if="clientsStore.error" :message="clientsStore.error" />
    <LoadingSpinner v-else-if="clientsStore.loading" />
    <div v-else-if="client" class="bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name *</label>
            <input type="text" id="name" v-model="form.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder="Enter client name" required />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status *</label>
            <select id="status" v-model="form.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" required>
              <option value="Prospect">Prospect</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="form.email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder="client@example.com" />
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" id="phone" v-model="form.phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder="+33 1 23 45 67 89" />
          </div>
        </div>
        <div class="flex justify-end space-x-4">
          <router-link to="/clients" class="px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            Cancel
          </router-link>
          <button type="submit" class="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg shadow-md hover:from-red-700 hover:to-orange-700 transition duration-300" :disabled="clientsStore.loading">
            <svg v-if="clientsStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ clientsStore.loading ? 'Updating...' : 'Update Client' }}
          </button>
        </div>
      </form>
    </div>
    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-gray-500">Client not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClientsStore } from '@/stores/clients';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import type { UpdateClientData } from '@/types';

const route = useRoute();
const router = useRouter();
const clientsStore = useClientsStore();

const client = computed(() => {
  const id = route.params.id as string;
  return clientsStore.getClientById(id);
});

const form = reactive<UpdateClientData>({
  name: '',
  status: 'Prospect',
  email: '',
  phone: '',
});

onMounted(() => {
  if (clientsStore.clients.length === 0) {
    clientsStore.fetchClients();
  }
});

watch(client, (newClient) => {
  if (newClient) {
    form.name = newClient.name;
    form.status = newClient.status;
    form.email = newClient.email || '';
    form.phone = newClient.phone || '';
  }
}, { immediate: true });

const handleSubmit = async () => {
  if (!client.value) return;

  try {
    const clientData: UpdateClientData = {
      name: form.name,
      status: form.status,
      email: form.email || undefined,
      phone: form.phone || undefined,
    };

    await clientsStore.updateClient(client.value.id, clientData);
    router.push('/clients');
  } catch (error) {
    console.error('Failed to update client:', error);
  }
};
</script>
