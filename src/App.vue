<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/common/NavBar.vue";
import BottomNavigation from "./components/common/BottomNavigation.vue";
</script>

<template>
  <header>
    <NavBar></NavBar>
  </header>

  <RouterView />
  <footer>
    <BottomNavigation></BottomNavigation>
  </footer>
</template>

<style></style>
