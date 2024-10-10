<script setup>
import { ref } from "vue";
import router from "../router";
import axios from "axios";
import MainButton from "../components/MainButton.vue";

import { useUser } from "../stores/User.js";
const user = useUser();

const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");

async function register() {
  if (password.value == password2.value) {
    await axios
      .post("http://127.0.0.1:3000/auth/register", {
        name: name.value,
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
  } else {
    console.log("Parola incorecta");
  }
}
</script>
<template>
  <div
    class="min-h-full flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:py-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-40 w-auto"
        src="/src/images/MemoryVerseLogo.svg"
        alt="Memory Verse Logo"
      />
      <h2
        class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-3"
      >
        Inregistrare
      </h2>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-3">
        <div>
          <label
            for="name"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Nume
          </label>
          <div class="mt-2">
            <input
              v-model="name"
              id="name"
              name="name"
              type="text"
              class="w-full block border rounded-lg border-gray-300 bg-gray-50 px-2.5 py-1.5 text-gray-900 sm:text-sm focus:ring-primary focus:border-primary"
              required=""
            />
          </div>
        </div>

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
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Parola
          </label>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              class="w-full block border rounded-lg border-gray-300 bg-gray-50 px-2.5 py-1.5 text-gray-900 sm:text-sm focus:ring-primary focus:border-primary"
              required=""
            />
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Repeta parola
          </label>
          <div class="mt-2">
            <input
              v-model="password2"
              id="password2"
              name="password2"
              type="password"
              class="w-full block border rounded-lg border-gray-300 bg-gray-50 px-2.5 py-1.5 text-gray-900 sm:text-sm focus:ring-primary focus:border-primary"
              required=""
            />
          </div>
        </div>

        <div>
          <MainButton
            @click="register"
            text="Inregistreaza-te"
            class="mt-6 lg:mt-3 w-full"
          >
          </MainButton>
        </div>
      </div>
    </div>
  </div>
</template>
