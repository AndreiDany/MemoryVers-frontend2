<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import axios from "axios";

import MainButton from "../components/MainButton.vue";

import { BookmarkIcon } from "@heroicons/vue/24/outline";

import { useBible } from "../stores/Bible.js";
import { useUser } from "../stores/User.js";
const bible = useBible();
const user = useUser();

const memorizedPassages = ref("");

onMounted(async () => {
  await axios
    .post("http://127.0.0.1:3000/biblePassages/memorizedPassages",
      {
        userId: user.id,
      },
      {
        headers: { Authorization: user.token, },
      }
  )
    .then((response) => {
      memorizedPassages.value = response.data.slice();
    })
    .catch((error) => {
      console.error("Eroare la primirea datelor de pe server: ", error);
    });
});

function memory(book, chapter, firstVers, lastVers, passageId) {
  if (user.id != 0) {
    bible.book = book;
    bible.chapter = chapter;
    bible.verses.first = firstVers;
    bible.verses.last = lastVers;
    bible.passageId = passageId;
    router.push("/entirePassage");
  }
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 lg:max-w-none"
  >
    <div
      class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24 mb-6"
    >
      <p class="text-2xl font-bold mb-4">Pasaje memorate</p>
      <ul class="overflow-y-auto">
        <li
          v-for="reference in memorizedPassages"
          :key="reference.id"
          :book="reference.book"
          :chapter="reference.chapter"
          :firstVers="reference.firstVers"
          :lastVers="reference.lastVers"
          :data="reference.data"
          class="mb-3 rounded-xl bg-white bg-opacity-50 flex items-center p-5 gap-x-4"
        >
          <BookmarkIcon class="h-10 w-10 text-gray-500" />

          <div class="flex-auto">
            <p class="text-base font-semibold leading-6 text-gray-900">
              {{ reference.book }} {{ reference.chapter }}:
              {{ reference.firstVers }}-{{ reference.lastVers }}
            </p>
            <p class="mt-1 truncate text-sm leading-5 text-gray-500">
              {{ reference.data }}
            </p>
          </div>
          <MainButton
            text="Repeta"
            class="h-min"
            @click="
              memory(
                reference.book,
                reference.chapter,
                reference.firstVers,
                reference.lastVers,
                reference.id
              )
            "
          ></MainButton>
        </li>
      </ul>
    </div>
  </div>
</template>
