<script setup>
const props = defineProps(["reference", "text"]);
</script>

<template>
  <div class="p-6 shadow-md rounded-lg h-64 w-full overflow-y-auto bg-white">
    <p class="text-lg font-semibold mb-4">{{ reference }}</p>
    <p class="text-lg text-gray-700">
      {{ text }}
    </p>
  </div>
</template>
