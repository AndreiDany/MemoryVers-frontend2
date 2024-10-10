<script setup>
import { ref } from "vue";
import router from "../../router";

import BottomNavigationButton from "../BottomNavigationButton.vue";
import Modal from "../Modal.vue";
import MainButton from "../MainButton.vue";

import {
  BookOpenIcon,
  ArrowPathIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/24/outline";

import { useBible } from "../../stores/Bible.js";
import { useUser } from "../../stores/User.js";
const bible = useBible();
const user = useUser();

const book = ref("");
const chapter = ref(0);
const vers = ref(1);
const title = ref("Alege versetul de inceput:");

const modalForBooks = ref(false);
const modalForChapter = ref(false);
const modalForVerses = ref(false);

function memorize() {
  if (user.id != 0) {
    modalForBooks.value = true;
  } else {
    router.push("/login");
  }
}

function chooseBook(oneBook) {
  book.value = oneBook;
  //console.log(book.value)

  modalForBooks.value = false;
  modalForChapter.value = true;
}

function chooseChapter(oneChapter) {
  chapter.value = oneChapter;
  //console.log(chapter.value)

  modalForChapter.value = false;
  modalForVerses.value = true;
}

function chooseVerse(oneVers) {
  //console.log(oneVers)

  if (vers.value == 1) {
    bible.verses.first = oneVers;
    vers.value = 2;
    title.value = "Alege versetul de final:";
  } else {
    bible.book = book.value.numeCarte;
    bible.chapter = chapter.value.numarCapitol;
    bible.verses.last = oneVers;
    bible.bibliePassages.index = 0;
    bible.passageId = 0;
    router.push("/entirePassage");
    modalForVerses.value = false;
    vers.value = 1;
    title.value = "Alege versetul de inceput:";
  }
}

function repeat() {
  if (user.id != 0) {
    router.push("/repeat");
  } else {
    router.push("/login");
  }
}
function finish() {
  if (user.id != 0) {
    router.push("/finish");
  } else {
    router.push("/login");
  }
}
</script>

<template>
  <section
    id="bottom-navigation"
    class="block fixed inset-x-0 bottom-0 z-10 shadow bg-white"
  >
    <div id="tabs" class="flex justify-between">
      <BottomNavigationButton
        @click="memorize"
        :icon="BookOpenIcon"
        label="Memoreaza"
      />
      <BottomNavigationButton
        @click="repeat"
        :icon="ArrowPathIcon"
        label="Repeta "
      />
      <BottomNavigationButton
        @click="finish"
        :icon="TrophyIcon"
        label="Finalizeaza"
      />
      <BottomNavigationButton
        :icon="QuestionMarkCircleIcon"
        label="Afla referinta"
      />
    </div>
  </section>

  <!-- Modalul pentru carte -->
  <Modal
    v-if="modalForBooks"
    v-model:modal="modalForBooks"
    title="Alege cartea:"
  >
    <div
      class="mb-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1"
    >
      <div v-for="oneBook in bible.bible" :key="oneBook.numeCarte">
        <MainButton
          :text="oneBook.numeCarte"
          @click="chooseBook(oneBook)"
          class="w-full"
        >
        </MainButton>
      </div>
    </div>
  </Modal>

  <!-- Modalul pentru capitole -->
  <Modal
    v-if="modalForChapter"
    v-model:modal="modalForChapter"
    title="Alege capitolul:"
  >
    <div
      class="mb-2 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-1"
    >
      <div v-for="oneChapter in book.capitole" :key="oneChapter.numarCapitol">
        <MainButton
          :text="oneChapter.numarCapitol"
          @click="chooseChapter(oneChapter)"
          class="w-full"
        >
        </MainButton>
      </div>
    </div>
  </Modal>

  <!-- Modalul pentru versete -->
  <Modal v-if="modalForVerses" v-model:modal="modalForVerses" :title="title">
    <div
      class="mb-2 max-h-32 overflow-y-auto grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-1"
    >
      <div v-for="oneVers in chapter.numarVersete" :key="oneVers">
        <MainButton
          :text="oneVers"
          @click="chooseVerse(oneVers)"
          class="w-full"
        >
        </MainButton>
      </div>
    </div>
  </Modal>
</template>
