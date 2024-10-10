<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import { MicrophoneIcon } from "@heroicons/vue/24/outline";
import MainButton from "../components/MainButton.vue";

import { useBible } from "../stores/Bible.js";
import { useUser } from "../stores/User.js";
const bible = useBible();
const user = useUser();

const bibliePassage = ref("");

const isRecording = ref(false);
const isLoading = ref(false);
const isReady = ref(false);

const recognition = ref(null);
const transcribedText = ref("");

onMounted(() => {
  isRecording.value = false;

  bibliePassage.value =
    bible.bibliePassages.passages[bible.bibliePassages.index];
});

function controlRecording() {
  if (isRecording.value == true) {
    isRecording.value = false;
    stopSpeechRecognition();
  } else {
    isRecording.value = true;
    startSpeechRecognition();
  }
}

function startSpeechRecognition() {
  recognition.value =
    new window.webkitSpeechRecognition() || new window.SpeechRecognition();

  recognition.value.lang = "ro-RO";

  // Gestionează evenimentul de rezultat
  recognition.value.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    transcribedText.value = result[0].transcript;
  };

  recognition.value.start();
}

async function stopSpeechRecognition() {
  recognition.value.stop();

  // Așteaptă 3 secunde înainte de a apela sendSpeechToServer
  await new Promise((resolve) => setTimeout(resolve, 3000));

  //Raspunsul audio venit de pe server
  const response = await sendSpeechToServer();

  const audioUrl = URL.createObjectURL(
    new Blob([response], { type: "audio/wav" })
  );

  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.src = audioUrl;
  audioPlayer.play();

  isReady.value = true;
}

async function sendSpeechToServer() {
  isLoading.value = true;
  var responseFromAssistant;

  await axios
    .post(
      "http://127.0.0.1:3000/voiceAssistantAI/textToSpeech",
      {
        bibleText: bibliePassage.value,
        transcribedText: transcribedText.value,
      },
      {
        headers: { Authorization: user.token, },
        responseType: "arraybuffer",
      }
    )
    .then((response) => {
      //console.log("Server response:", response.data);
      responseFromAssistant = response.data;
    })
    .catch((error) => {
      console.error("Eroare la trimiterea datelor pe server: ", error);
    });

  isLoading.value = false;

  return responseFromAssistant;
}

function nextPassage() {
  // Pentru a verifica intregul pasaj memorat pana in punctul actual
  // if( o anumita variabila initializata la inceput care se modifică in aceasta functie ) {
  // bibliePassage.value = intregul pasaj memorat pana in punctul actual }
  // else { codul de mai jos si sa treaca la pagina de memorare }

  saveProgress();
  if (bible.bibliePassages.index < bible.bibliePassages.passages.length - 1) {
    bible.bibliePassages.index = bible.bibliePassages.index + 1;
    bibliePassage.value =
      bible.bibliePassages.passages[bible.bibliePassages.index];
  }
}

async function saveProgress() {
  await axios
    .post("http://127.0.0.1:3000/biblePassages/progress",
      {
        id: bible.passageId,
        index: bible.bibliePassages.index,
      },
      {
        headers: { Authorization: user.token, },
        responseType: "arraybuffer",
      }
    )
    .then((response) => {
      //console.log("Server response:", response.data);
    })
    .catch((error) => {
      console.error("Eroare la trimiterea progresului pe server: ", error);
    });
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32 lg:max-w-none"
  >
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24 mb-6"
      >
        <p v-if="!isReady && !isLoading" class="text-2xl font-bold mb-4">
          Rosteste pasajul memorat
        </p>
        <p v-if="isReady && !isLoading" class="text-xl font-bold mb-3">
          Rosteste din nou pasajul memorat
        </p>

        <div v-if="!isLoading" @click="controlRecording" class="relative mb-3">
          <button
            class="h-36 w-36 rounded-full bg-primary flex items-center justify-center relative z-10"
            :class="{ 'animate-pulse': isRecording }"
          ></button>

          <MicrophoneIcon
            class="h-28 w-28 p-2 rounded-full bg-primary text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          ></MicrophoneIcon>
        </div>

        <div v-if="isLoading" class="relative mb-3">
          <button
            class="h-36 w-36 rounded-full bg-primary flex items-center justify-center relative z-10"
          >
            <div class="h-14 w-14 loader rounded-full border-white"></div>
          </button>
        </div>

        <audio
          id="audioPlayer"
          controls
          class="bg-gray-100 rounded-full p-4 shadow-md"
        ></audio>

        <!-- <BibleTextCard v-if="isReady" :text="spokenPassage"></BibleTextCard> -->
      </div>

      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24"
      >
        <div
          v-if="isReady"
          class="mb-3 p-5 shadow-md rounded-lg h-40 w-full overflow-y-auto bg-white"
        >
          <p class="text-lg font-semibold mb-2">Pasajul biblic</p>
          <p class="text-lg text-gray-700">
            {{ bibliePassage }}
          </p>
        </div>

        <div
          v-if="isReady"
          class="p-5 shadow-md rounded-lg h-40 w-full overflow-y-auto bg-white"
        >
          <p class="text-lg font-semibold mb-2">Pasajul rostit</p>
          <p class="text-lg text-gray-700">
            {{ transcribedText }}
          </p>
        </div>
      </div>
    </div>

    <RouterLink v-if="isReady" to="/memorize" class="fixed bottom-20 right-3">
      <MainButton
        @click="nextPassage"
        text="Treci mai departe"
        class="shadow-md"
      >
      </MainButton>
    </RouterLink>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-pulse {
  animation: pulse 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader {
  border-top-color: #00dee8;
  border-right-color: #00dee8;
  border-left-color: #00dee8;
  border-width: 7px;
  animation: spin 1.2s linear infinite;
}
</style>
