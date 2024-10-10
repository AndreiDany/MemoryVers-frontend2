<script setup>
const props = defineProps(["title"]);

const modal = defineModel("modal");

function hideModal() {
  modal.value = false;
}
</script>
<template>
  <div
    class="fixed flex justify-center items-center inset-0 bg-opacity-50 bg-black"
  >
    <div class="p-4 w-3/4 md:w-1/2 flex flex-col rounded bg-white">
      <p class="text-l font-bold mb-3">{{ title }}</p>
      <div class=" max-h-48 overflow-y-auto"><slot></slot></div>

      <div class="px-4 py-3 sm:px-6 bg-gray-50 sm:flex sm:flex-row-reverse">
        <button
          class="px-3 py-2 shadow-sm w-full sm:w-auto rounded-md bg-white hover:bg-gray-300 ring-1 ring-inset ring-gray-300 mt-3 sm:mt-0 inline-flex justify-center text-sm font-semibold text-gray-900"
          @click="hideModal"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
