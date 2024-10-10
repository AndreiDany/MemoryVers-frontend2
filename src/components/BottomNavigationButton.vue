<script setup>
const props = defineProps(["link", "icon", "label"]);
</script>

<template>
  <button
    class="w-full focus:text-cyan-700 hover:text-primary justify-center inline-block text-center pt-2 pb-1"
  >
    <component :is="icon" class="inline-block mb-1 h-8 w-8" />
    <span class="tab block text-xs">{{ label }}</span>
  </button>
</template>
