<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import BibleTextCard from "../components/BibleTextCard.vue";
import MainButton from "../components/MainButton.vue";

import { useBible } from "../stores/Bible.js";
import { useUser } from "../stores/User.js";
const bible = useBible();
const user = useUser();

const bibleVersionKey = "rccv";
const verseReference =
  bible.book +
  " " +
  bible.chapter +
  ":" +
  bible.verses.first +
  "-" +
  bible.verses.last;

const bibliePassage = ref();

onMounted(() => {
  axios
    .get(
      `https://bible-api.com/${verseReference}?translation=${bibleVersionKey}`,
      {}
    )
    .then(function (response) {
      //console.log(response.data)
      bibliePassage.value = response.data;
    })
    .catch(function (error) {
      console.log("Eroare la obtinerea pasajului biblic!" + error);
    });
});

function sliceBibliePassage() {
  var text = bibliePassage.value.text;

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

  //console.log(rezultat);
  bible.bibliePassages.passages = rezultat;

  saveProgress();
}

async function saveProgress() {
  if (bible.passageId == 0) {
    await axios
      .post("http://127.0.0.1:3000/biblePassages/",
        {
        book: bible.book,
        chapter: bible.chapter,
        firstVers: bible.verses.first,
        lastVers: bible.verses.last,
        index: 0,
        length: bible.bibliePassages.passages.length,
        userId: user.id,
        },
        {
          headers: { Authorization: user.token, },
        }
      )
      .then((response) => {
        //console.log("Server response:", response.data);
        bible.passageId = response.data.id;
        //console.log(bible.passageId);
      })
      .catch((error) => {
        console.error(
          "Eroare la trimiterea pasajului biblic pe server: ",
          error
        );
      });
  } else {
    await axios
      .post("http://127.0.0.1:3000/biblePassages/progress", {
        id: bible.passageId,
        index: 0,
      })
      .then((response) => {
        //console.log("Server response:", response.data);
      })
      .catch((error) => {
        console.error("Eroare la trimiterea progresului pe server: ", error);
      });
  }
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 lg:max-w-none"
  >
    <div class="grid grid-cols-1 md:grid-cols-2">
      <!-- Caseta text -->
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24 mb-6"
      >
        <p class="text-2xl font-bold mb-4">{{ verseReference }}</p>
        <BibleTextCard
          :reference="bibliePassage?.reference"
          :text="bibliePassage?.text"
        ></BibleTextCard>
      </div>

      <!-- Setul de butoane -->
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24"
      >
        <RouterLink to="/memorize" @click="sliceBibliePassage" class="m-3">
          <MainButton text="Începe memorarea prin rostire"></MainButton>
        </RouterLink>

        <!-- <RouterLink to="/memorize" @click="sliceBibliePassage" class="m-3">
          <MainButton text="Începe memorarea prin scriere"></MainButton>
        </RouterLink> -->

        <!-- <MainButton text="Sectioneaza" @click="sliceBibliePassage"></MainButton> -->
      </div>
    </div>
  </div>
</template>
