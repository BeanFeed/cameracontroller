<script setup lang="js">

const store = useStore()

let timeDelay;

onMounted(() => {
  store.pollPlayers()
  timeDelay = setInterval(() => {
    store.pollPlayers()
  }, 1000)
})

onUnmounted(() => {
  timeDelay.clearInterval()
})

</script>

<template>
  <div class="w-full h-full overflow-clip p-10">
    <div class="h-full overflow-y-scroll">
      <TransitionGroup name="player-list" tag="div" class="grid grid-cols-1 place-items-center gap-y-2">
        <PlayerRow
            v-for="(player, index) in store.getPlayers"
            :key="`${player.name}-${index}`"
            :player="player"
            :position="index + 1"
            class="w-full max-w-3xl"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.player-list-move {
  transition: transform 0.5s ease;
}
</style>

<style scoped>

</style>