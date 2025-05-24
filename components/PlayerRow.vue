<script setup lang="js">

import {SendCameraControl} from "~/requests.js";

const props = defineProps({
  player: {
    type: Object,
    required: true
  },
  position: {
    type: Number,
    required: true
  }
})

function getTimeColor(timeDiff, alpha) {
  let red, green, blue;

  if(timeDiff === 0) {
    red = 3;
    green = 169;
    blue = 252;
  } else if(timeDiff === -1) {
    red = 100;
    green = 100;
    blue = 100;
  } else {
    blue = 0;
    // For 0, return red
    if (timeDiff <= 0) {
      red = 255;
      green = 0;
    }
    // For 600 or less, return pink
    else if (timeDiff <= 600) {
        red = 240;
        green = 7;
        blue = 252;
    }
    // For 7000 or more, return green
    else if (timeDiff >= 7000) {
      red = 0;
      green = 255;
    }
    // For values between, create a gradient from red to green
    else {
      const percentage = timeDiff / 7000;
      red = Math.round(255 * (1 - percentage));
      green = Math.round(255 * percentage);
    }
  }


  // Convert to hex format
  //const redHex = red.toString(16).padStart(2, '0');
  //const greenHex = green.toString(16).padStart(2, '0');
  //const blueHex = blue.toString(16).padStart(2, '0');

  //return `#${redHex}${greenHex}${blueHex}`;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

async function cameraCommand(camera) {
  await SendCameraControl(camera, props.player.name, useToast());
}

</script>

<template>
<UCard class="ring-0 border-4" :style="`border-color: ${getTimeColor(player.timeDiff, 1.0)}; background-color: ${getTimeColor(player.timeDiff, 0.2)};`">
  <div class="flex space-x-2 items-center justify-between">
    <div class="flex space-x-2 items-center">
      <b :style="`color: ${player.teamColor1}; margin-right: 0px;`">/</b>
      <b :style="`color: ${player.teamColor2};`">/</b>
      <Icon v-if="position === 1" name="bi:trophy-fill" class="text-yellow-500" />
      <p class="text-xl" v-else>{{position}}</p>
      <p class="text-xl">{{player.name}}</p>
      <p v-if="player.timeDiff >= 0">{{player.timeDiff}}ms</p>
      <p v-else>DNF</p>
    </div>
    <div class="flex space-x-2 items-center">
      <UButton @click="cameraCommand(1)">Camera 1</UButton>
      <UButton @click="cameraCommand(2)" class="bg-sky-400 hover:bg-sky-600">Camera 2</UButton>
      <UButton @click="cameraCommand(3)" class="bg-purple-400 hover:bg-purple-600">Camera 3</UButton>
      <UButton @click="cameraCommand(4)" class="bg-red-400 hover:bg-red-600">Camera 4</UButton>
      <UButton @click="cameraCommand(5)" class="bg-yellow-400 hover:bg-yellow-600">Camera 5</UButton>
    </div>
  </div>

</UCard>
</template>

<style scoped>

</style>