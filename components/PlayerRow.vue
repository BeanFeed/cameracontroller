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
  },
  snapshotposition: {
    type: Number,
    required: false
  },
  showCamControls: {
    type: Boolean,
    default: true
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
  } else if(timeDiff === -2) {
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

const isMinWidth1280 = useMediaQuery('(min-width: 1280px)');

const snapshotChange = computed(() => {
    if(props.snapshotposition == null) {
        return 0;
    }
    
    return props.snapshotposition - props.position;
});

</script>

<template>
<UCard class="ring-0 border-4" :style="`border-color: ${getTimeColor(player.timeDiff, 1.0)}; background-color: ${getTimeColor(player.timeDiff, 0.2)};`">
  <div class="flex space-x-2 items-center justify-between">
    <div class="flex space-x-2 items-center">
      <b :style="`color: ${player.teamColor1}; margin-right: 0px;`">/</b>
      <b :style="`color: ${player.teamColor2};`">/</b>
      <Icon v-if="position === 1" name="bi:trophy-fill" class="text-yellow-500 w-7" />
      <p class="text-xl text-orange-500 w-7" v-else>{{position}}</p>
        <span v-if="snapshotposition != null">
            <span v-if="snapshotChange > 0" >⬆️</span>
            <span v-else-if="snapshotChange < 0" >⬇️</span>
            &nbsp;
            <span v-if="snapshotChange !== 0" style="font-size: 1.35em;" :style="`color: ${snapshotChange >= 0 ? 'white' : 'red' }`">{{Math.abs(snapshotChange)}}</span>
        </span>
      <UPopover mode="hover">
        <UButton variant="ghost" class="text-xl w-35 overflow-clip text-white">{{player.name}}</UButton>
        <template #content>
          <p class="p-2">{{player.name}}</p>
        </template>
      </UPopover>
      <p v-if="player.timeDiff >= 0" class="w-20">{{player.timeDiff}}ms</p>
      <p v-else-if="player.timeDiff === -2" class="w-20">In Pit</p>
      <p v-else class="w-20">DNF</p>
    <p class="text-xl text-blue-500 ml-2">{{player.pits}}</p>
    </div>
    <div class="flex space-x-2 items-center" v-if="showCamControls">
      <template v-if="isMinWidth1280">
        <UButton @click="cameraCommand(1)" class="">Camera 1</UButton>
        <UButton @click="cameraCommand(2)" class=" bg-sky-400 hover:bg-sky-600">Camera 2</UButton>
        <UButton @click="cameraCommand(3)" class=" bg-purple-400 hover:bg-purple-600">Camera 3</UButton>
        <UButton @click="cameraCommand(4)" class=" bg-red-400 hover:bg-red-600">Camera 4</UButton>
        <UButton @click="cameraCommand(5)" class=" bg-yellow-400 hover:bg-yellow-600">Camera 5</UButton>
      </template>
      <template v-else>
        <UButton @click="cameraCommand(1)">1</UButton>
        <UButton @click="cameraCommand(2)" class="bg-sky-400 hover:bg-sky-600">2</UButton>
        <UButton @click="cameraCommand(3)" class="bg-purple-400 hover:bg-purple-600">3</UButton>
        <UButton @click="cameraCommand(4)" class="bg-red-400 hover:bg-red-600">4</UButton>
        <UButton @click="cameraCommand(5)" class="bg-yellow-400 hover:bg-yellow-600">5</UButton>
      </template>

    </div>
  </div>

</UCard>
</template>

<style scoped>

</style>