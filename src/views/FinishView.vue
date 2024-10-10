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

const unfinishedPassages = ref("");

onMounted(async () => {
  await axios
    .post("http://127.0.0.1:3000/biblePassages/unfinishedPassages",
      {
      userId: user.id,
      },
      {
        headers: { Authorization: user.token, },
      }
    )
    .then((response) => {
      unfinishedPassages.value = response.data.slice();
    })
    .catch((error) => {
      console.error("Eroare la primirea datelor de pe server: ", error);
    });
});

async function configPassage(book, chapter, firstVers, lastVers, index, id) {
  const bibleVersionKey = "rccv";
  const verseReference =
    book + " " + chapter + ":" + firstVers + "-" + lastVers;

  await axios
    .get(
      `https://bible-api.com/${verseReference}?translation=${bibleVersionKey}`,
      {}
    )
    .then(function (response) {
      sliceBibliePassage(response.data);
      bible.bibliePassages.index = index + 1;
      bible.book = book;
      bible.chapter = chapter;
      bible.verses.first = firstVers;
      bible.verses.last = lastVers;
      bible.passageId = id;
      //console.log(bible.bibliePassages.passages[bible.bibliePassages.index]);
      router.push("/memorize");
    })
    .catch(function (error) {
      console.log("Eroare la obtinerea pasajului biblic!" + error);
    });
}

function sliceBibliePassage(bibliePassage) {
  var text = bibliePassage.text;

  const lungimeMaxima = 36;
  const rezultat = [];

  let indexStart = 0;

  while (indexStart < text.length) {
    let indexSfarsit = indexStart + lungimeMaxima;

    if (indexSfarsit < text.length) {
      while (
        !(/[.!?;:,]/.test(text[indexSfarsit]) && indexSfarsit < text.length)
      ) {
        indexSfarsit++;
      }
    }

    rezultat.push(text.slice(indexStart, indexSfarsit + 1));
    indexStart = indexSfarsit;

    // Ignora caracterele de separator
    while (/[.!?;:,\s]/.test(text[indexStart]) && indexStart < text.length) {
      indexStart++;
    }
  }

  bible.bibliePassages.passages = rezultat;
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 lg:max-w-none"
  >
    <div
      class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24 mb-6"
    >
      <p class="text-2xl font-bold mb-4">Pasaje nefinalizate</p>
      <ul class="overflow-y-auto">
        <li
          v-for="reference in unfinishedPassages"
          :key="reference.id"
          :book="reference.book"
          :chapter="reference.chapter"
          :firstVers="reference.firstVers"
          :lastVers="reference.lastVers"
          :index="reference.index"
          :length="reference.length"
          :data="reference.data"
          class="relative mb-3 rounded-xl bg-white bg-opacity-50 flex items-center p-5 gap-x-4"
        >
          <!-- <div class="text-sm font-bold text-secondary">
              {{ Math.floor((reference.index * 100) / reference.length) }}%
            </div> -->
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
            text="Finalizeza"
            class="h-min"
            @click="
              configPassage(
                reference.book,
                reference.chapter,
                reference.firstVers,
                reference.lastVers,
                reference.index,
                reference.id
              )
            "
          ></MainButton>

          <div
            :style="{
              width: `${((reference.index + 1) * 100) / reference.length}%`,
            }"
            class="absolute bottom-0 left-0 h-3 rounded-l-xl rounded-t-none bg-primary bg-opacity-75"
          ></div>
          <div
            :style="{
              width: `${100 - ((reference.index + 1) * 100) / reference.length}%`,
            }"
            class="absolute bottom-0 right-0 h-3 rounded-r-xl rounded-t-none bg-white"
          ></div>
        </li>
      </ul>
    </div>
  </div>
</template>
