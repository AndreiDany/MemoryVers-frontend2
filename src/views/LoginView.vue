<script setup>
import { ref } from "vue";
import router from "../router";
import axios from "axios";
import MainButton from "../components/MainButton.vue";

import { useUser } from "../stores/User.js";
const user = useUser();

const email = ref("");
const password = ref("");

async function login() {
  await axios
    .post("http://127.0.0.1:3000/auth/login", {
      email: email.value,
      password: password.value,
    })
    .then(function (response) {
      user.setToken(response.data.token);
      user.id = response.data.id;
      user.name = response.data.name;
      user.email = response.data.email;
      router.push("/");
    })
    .catch(function (error) {
      console.log("Eroare la conectare: " + error);
    });
}
</script>
<template>
  <div
    class="min-h-full flex flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-48 w-auto"
        src="/src/images/MemoryVerseLogo.svg"
        alt="Memory Verse Logo"
      />
      <h2
        class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4"
      >
        Conectare
      </h2>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-6">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Email
          </label>
          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              class="w-full block border rounded-lg border-gray-300 bg-gray-50 px-2.5 py-1.5 text-gray-900 sm:text-sm focus:ring-primary focus:border-primary"
              autocomplete="email"
              required=""
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Parola
            </label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-primary hover:text-cyan-700"
                >Ai uitat parola?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              class="w-full block border rounded-lg border-gray-300 bg-gray-50 px-2.5 py-1.5 text-gray-900 sm:text-sm focus:ring-primary focus:border-primary"
              autocomplete="current-password"
              required=""
            />
          </div>
        </div>

        <div>
          <MainButton
            @click="login"
            text="Intra in cont"
            class="mt-6 lg:mt-3 w-full"
          >
          </MainButton>
        </div>
      </div>

      <p class="mt-10 text-center text-sm text-gray-500">
        Nu ai cont?
        {{ " " }}
        <RouterLink
          to="/register"
          class="font-semibold leading-6 text-primary hover:text-cyan-700"
          >Inregistreaza-te gratuit!</RouterLink
        >
      </p>
    </div>
  </div>
</template>
