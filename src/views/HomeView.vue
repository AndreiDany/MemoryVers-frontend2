<script setup>
import { ref } from "vue";

import BibleTextCard from "../components/BibleTextCard.vue";
import MainButton from "../components/MainButton.vue";
import router from "../router";

import { useBible } from "../stores/Bible.js";
import { useUser } from "../stores/User.js";
const bible = useBible();
const user = useUser();

const dailyVerseReference = ref("Psalmul 119:9 VDC");
const dailyVerseText = ref(
  "Cum își va ține tânărul curată cărarea? Îndreptându-se după Cuvântul Tău."
);

function memory() {
  if (user.id != 0) {
    bible.book = "Psalmul";
    bible.chapter = 119;
    bible.verses.first = 9;
    bible.verses.last = 9;

    router.push("/entirePassage");
  } else {
    router.push("/login");
  }
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 lg:max-w-none"
  >
    <div class="grid grid-cols-1 md:grid-cols-2">
      <!-- Caseta text si butonul corespunzator -->
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24 mb-6"
      >
        <p class="text-2xl font-bold mb-4">Versetul zilei</p>
        <BibleTextCard
          :reference="dailyVerseReference"
          :text="dailyVerseText"
        ></BibleTextCard>
        <MainButton text="Memoreaza" @click="memory"></MainButton>
      </div>

      <!-- Grafic -->
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24"
      >
        <div
          v-if="user.id != 0"
          class="p-6 shadow-md rounded-lg h-64 w-full overflow-y-auto bg-white bg-opacity-50"
        >
          <p class="text-lg font-semibold mb-4">Progresul tau</p>

          <div class="flex justify-between mb-3 bg-gray bg-opacity-50">
            <p class="text-xl font-semibold text-cyan-700">Versete Memorate:</p>
            <p class="px-12 text-xl font-bold text-primary">36</p>
          </div>
          <div class="flex justify-between mb-2">
            <div>
              <p class="text-xl font-semibold text-cyan-700">Carti parcuse:</p>
              <p class="font-semibold text-cyan-700 text-sm">
                (partial sau total)
              </p>
            </div>
            <p class="px-12 text-xl font-bold text-primary">3</p>
          </div>
          <div class="flex justify-between mb-3">
            <p class="text-xl font-semibold text-cyan-700">
              Pasaje finalizate:
            </p>
            <p class="px-12 text-xl font-bold text-primary">7</p>
          </div>
          <div class="flex justify-between">
            <p class="text-xl font-semibold text-cyan-700">Zile active:</p>
            <p class="px-12 text-xl font-bold text-primary">10</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
