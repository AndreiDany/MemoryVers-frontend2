<script setup>
import { ref } from "vue";
import axios from "axios";

import { MicrophoneIcon } from "@heroicons/vue/24/outline";

import { useBible } from "../stores/Bible.js";
const bible = useBible();

const isRecording = ref(false);
const isLoading = ref(false);
const isReady = ref(false);

const mediaRecorder = ref(null);
const audioChunks = ref([]);
const recording = ref(false);

const spokenPassage = ref("");

function controlRecording() {
  if (isRecording.value == true) {
    isRecording.value = false;
    stopRecording();
  } else {
    isRecording.value = true;
    startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: "audio/wav" });

      //Raspunsul audio venit de pe server
      const response = await sendAudioToServer(audioBlob);

      const audioUrl = URL.createObjectURL(
        new Blob([response], { type: "audio/wav" })
      );

      const audioPlayer = document.getElementById("audioPlayer");
      audioPlayer.src = audioUrl;
      audioPlayer.play();

      audioChunks.value = [];

      //spokenPassage = await speechToText(audioBlob);
      isReady.value = true;
      //console.log(spokenPassage.value);
      //console.log(bible.bibliePassage);
    };

    mediaRecorder.value.start();
    recording.value = true;
  } catch (error) {
    console.error("Eroare la accesarea microfonului:", error);
  }
}

function stopRecording() {
  mediaRecorder.value.stop();
  recording.value = false;
}

async function sendAudioToServer(audioBlob) {
  isLoading.value = true;
  var responseFromAssistant;

  const formData = new FormData();
  formData.append("audio", audioBlob);
  formData.append("text", bible.bibliePassage);

  await axios
    .post("http://127.0.0.1:3000/voiceAssistantAI/speechToSpeech", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer",
    })
    .then((response) => {
      responseFromAssistant = response.data;
    })
    .catch((error) => {
      console.error("Eroare la trimiterea datelor pe server: ", error);
    });

  isLoading.value = false;

  return responseFromAssistant;
}
</script>

<template>
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 lg:max-w-none"
  >
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24 mb-8"
      >
        <p class="text-2xl font-bold mb-4">Rosteste pasajul memorat</p>

        <div v-if="!isLoading" @click="controlRecording" class="relative mb-8">
          <button
            class="h-36 w-36 rounded-full bg-primary flex items-center justify-center relative z-10"
            :class="{ 'animate-pulse': isRecording }"
          ></button>

          <MicrophoneIcon
            class="h-28 w-28 p-2 rounded-full bg-primary text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          ></MicrophoneIcon>
        </div>

        <div v-if="isLoading" class="relative mb-8">
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
      </div>

      <div
        class="flex flex-col items-center justify-center px-2 sm:px-16 md:px-8 lg:px-16 xl:px-24"
      >
        <div
          v-if="isReady"
          class="p-6 shadow-md rounded-lg h-40 w-full overflow-y-auto bg-white"
        >
          <p class="text-lg font-semibold mb-4">Pasajul biblic</p>
          <p class="text-lg text-gray-700">
            {{ bible.bibliePassage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
