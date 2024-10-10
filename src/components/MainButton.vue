<script setup>
const props = defineProps(["text"]);
</script>

<template>
  <button
    class="py-2 px-4 rounded-md bg-primary hover:bg-cyan-700 text-white font-bold"
  >
    {{ text }}
  </button>
</template>
