<script setup>

import {useStore} from "~/stores/store.js";

const store = useStore()

onMounted(async () => {
  //await store.pollPlayers()
})

</script>

<template>
  <NuxtLayout class="h-screen w-screen">
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

@layer base {
  *,
  *::before,
  *::after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  /* For Firefox. */
  * {
    scrollbar-width: none;
  }

  /* For WebKit (Chrome & Safari). */
  ::-webkit-scrollbar {
    display: none;
  }
}

</style>
