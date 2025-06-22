<script setup lang="js">
    const usePitDelta = ref(false);
    const pitDelta = ref(0);
    
    const snapshot = ref(null);
    
    const store = useStore();
    
    let timeDelay;
    
    onMounted(() => {
        store.pollPlayers();
        timeDelay = setInterval(() => {
            store.pollPlayers();
        }, 1000);
    })
    
    onUnmounted(() => {
        timeDelay.clearInterval();
    })
    
    const playersSortedUsingPitDelta = computed(() => {
        const originalPlayers = store.getPlayers;
        
        if (!usePitDelta.value) {
            return originalPlayers;
        }
        
        // Step 1: Convert relative timeDiffs to absolute times (from race leader)
        let cumulativeTime = 0;
        const playersWithAbsoluteTimes = originalPlayers.map(player => {
            cumulativeTime += player.timeDiff;
            const absoluteTime = cumulativeTime;
            return {
                ...player,
                absoluteTime
            };
        });
        
        // Step 2: Subtract pit delta to simulate time gained
        const adjustedPlayers = playersWithAbsoluteTimes.map(player => ({
            ...player,
            adjustedTime: player.absoluteTime - (player.pits * pitDelta.value)
        }));
        
        // Step 3: Sort by adjusted time
        adjustedPlayers.sort((a, b) => a.adjustedTime - b.adjustedTime);
        
        // Step 4: Recalculate new timeDiffs (relative to the player in front)
        let prevTime = adjustedPlayers[0].adjustedTime;
        return adjustedPlayers.map((player, index) => {
            const timeDiff = index === 0 ? 0 : player.adjustedTime - prevTime;
            prevTime = player.adjustedTime;
            return {
                ...player,
                timeDiff
            };
        });
    });
    
    function takeSnapshot(){
        const data = playersSortedUsingPitDelta.value;
        snapshot.value = JSON.parse(JSON.stringify(data));
    }
    
    function clearSnapshot(){
        snapshot.value = null;
    }
    
    function getSnapshotPlayerPosition(playerName){
        if(snapshot.value == null){
            return null;
        }
        
        let pos = 1;
        for(let player of snapshot.value){
            if(player.name === playerName){
                return pos;
            }
            
            pos ++;
        }
        
        return null;
    }
</script>

<template>
    <div class="w-full h-full overflow-clip p-10">
      <div class="h-full overflow-y-scroll">
        <div class="flex space-x-2 items-center">
            <UCheckbox v-model="usePitDelta" label="Use Pit Delta" />
            <UInput type="number" v-model="pitDelta" />
          </div>
          <div class="flex space-x-2 items-center mt-5">
            <UButton @click="takeSnapshot">Take snapshot</UButton>
            <UButton @click="clearSnapshot">Clear snapshot</UButton>
          </div>
          <div class="flex items-center justify-center mt-5 space-x-2">
            <div class="grid grid-cols-1 place-items-center gap-y-2">
              <PlayerRow
                  v-for="(player, index) in playersSortedUsingPitDelta"
                  :key="`${player.name}-${index}`"
                  :player="player"
                  :snapshotposition="getSnapshotPlayerPosition(player.name)"
                  :position="index + 1"
                  class="w-full max-w-4xl"
              />
            </div>
          </div>

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
