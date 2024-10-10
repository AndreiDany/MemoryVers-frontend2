<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import BibleTextCard from "../components/BibleTextCard.vue";
import MainButton from "../components/MainButton.vue";

import {
  BackwardIcon,
  ForwardIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/vue/24/outline";

import { useBible } from "../stores/Bible.js";
import { useUser } from "../stores/User.js";
const bible = useBible();
const user = useUser();

const bibleReference = ref("");
const bibliePassage = ref("");

const isSpeaking = ref(false);
const audioPlayer = ref(null);

onMounted(() => {
  bibleReference.value =
    bible.book +
    " " +
    bible.chapter +
    ":" +
    bible.verses.first +
    "-" +
    bible.verses.last;

  bibliePassage.value =
    bible.bibliePassages.passages[bible.bibliePassages.index];

  if (bibliePassage.value != null) {
    getTheSpeech();
  }
});

function nextPassage() {
  if (bible.bibliePassages.index < bible.bibliePassages.passages.length - 1) {
    bible.bibliePassages.index = bible.bibliePassages.index + 1;
    bibliePassage.value =
      bible.bibliePassages.passages[bible.bibliePassages.index];
    getTheSpeech();
    isSpeaking.value = false;
  }
}

function previousPassage() {
  if (bible.bibliePassages.index > 0) {
    bible.bibliePassages.index = bible.bibliePassages.index - 1;
    bibliePassage.value =
      bible.bibliePassages.passages[bible.bibliePassages.index];
    getTheSpeech();
    isSpeaking.value = false;
  }
}

function controlSpeaking() {
  if (isSpeaking.value == true) {
    isSpeaking.value = false;
    audioPlayer.value.pause();
  } else {
    isSpeaking.value = true;
    audioPlayer.value.play();
  }
}

async function getTheSpeech() {
  await axios
    .post(
      "http://127.0.0.1:3000/voiceAssistantAI/speechThePassage",
      {
        text: bibliePassage.value,
      },
      {
        headers: { Authorization: user.token, },
        responseType: "arraybuffer",
      }
    )
    .then((response) => {
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = window.URL.createObjectURL(blob);
      audioPlayer.value.src = url;
      console.log("Textul poate fi rostit");
    })
    .catch((error) => {
      console.error("Eroare la trimiterea datelor pe server: ", error);
    });
}
</script>
<template>
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 lg:max-w-none"
  >
    <div class="grid grid-cols-1 md:grid-cols-2">
      <!-- Caseta text si butoanele corespunzator -->
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24 mb-6"
      >
        <p class="text-2xl font-bold mb-4">{{ bibleReference }}</p>
        <BibleTextCard
          :reference="bibleReference"
          :text="bibliePassage"
        ></BibleTextCard>

        <div class="flex mt-1">
          <BackwardIcon @click="previousPassage" class="h-9 w-9 text-accent" />

          <PlayIcon
            id="audioPlayer"
            v-if="!isSpeaking"
            @click="controlSpeaking"
            class="h-9 w-9 text-accent mx-16"
          />

          <StopIcon
            id="audioPlayer"
            v-if="isSpeaking"
            @click="controlSpeaking"
            class="h-9 w-9 text-accent mx-16"
          />

          <ForwardIcon @click="nextPassage" class="h-9 w-9 text-accent" />
        </div>
        <audio ref="audioPlayer"></audio>
      </div>

      <!-- Setul de butoane -->
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24"
      >
        <RouterLink to="/verify" class="fixed bottom-20 right-3">
          <MainButton text="Verifica-te"></MainButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
