<template>
  <div
    v-if="show"
    :class="[
      'p-4 rounded-md mb-4',
      type === 'success' ? 'bg-green-100 text-green-800' : '',
      type === 'error' ? 'bg-red-100 text-red-800' : '',
      type === 'warning' ? 'bg-yellow-100 text-yellow-800' : '',
      type === 'info' ? 'bg-blue-100 text-blue-800' : ''
    ]"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <component :is="iconComponent" class="h-5 w-5" />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium">
          <slot></slot>
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="[
              type === 'success' ? 'bg-green-100 text-green-500 hover:bg-green-200 focus:ring-green-600 focus:ring-offset-green-50' : '',
              type === 'error' ? 'bg-red-100 text-red-500 hover:bg-red-200 focus:ring-red-600 focus:ring-offset-red-50' : '',
              type === 'warning' ? 'bg-yellow-100 text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-600 focus:ring-offset-yellow-50' : '',
              type === 'info' ? 'bg-blue-100 text-blue-500 hover:bg-blue-200 focus:ring-blue-600 focus:ring-offset-blue-50' : ''
            ]"
            @click="$emit('close')"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/vue/outline' 

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  type: {
    type: String as () => 'success' | 'error' | 'warning' | 'info',
    default: 'info'
  }
})

defineEmits(['close'])

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return ExclamationCircleIcon
    case 'warning':
      return ExclamationIcon
    default:
      return InformationCircleIcon
  }
})
</script>