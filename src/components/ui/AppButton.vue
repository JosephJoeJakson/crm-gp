<template>
  <button
    :type="type"
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors',
      variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : '',
      variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : '',
      variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' : ''
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  variant: {
    type: String as () => 'primary' | 'secondary' | 'danger',
    default: 'primary'
  }
})

defineEmits(['click'])
</script>