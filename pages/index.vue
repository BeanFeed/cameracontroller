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
            const absoluteTime = cumulativeTime;
            cumulativeTime += player.timeDiff;
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
</script>

<template>
    <div class="w-full h-full overflow-clip p-10">
        <div class="h-full overflow-y-scroll">
            <input type="checkbox" v-model="usePitDelta" />
            <input type="number" v-model="pitDelta" />
            <br />
            <TransitionGroup name="player-list" tag="div" class="grid grid-cols-1 place-items-center gap-y-2">
                <PlayerRow
                    v-for="(player, index) in playersSortedUsingPitDelta"
                    :key="`${player.name}-${index}`"
                    :player="player"
                    :position="index + 1"
                    class="w-full max-w-3xl"
                />
            </TransitionGroup>
            <br />
            <br />
            <br />
            <button @click="takeSnapshot">Take snapshot</button>
            <button @click="clearSnapshot">Clear snapshot</button>
            <br />
            <template v-if="snapshot != null">
                <TransitionGroup name="player-list-snapshot" tag="div" class="grid grid-cols-1 place-items-center gap-y-2">
                    <PlayerRow
                        v-for="(player, index) in snapshot"
                        :key="`${player.name}-${index}`"
                        :player="player"
                        :position="index + 1"
                        class="w-full max-w-3xl"
                    />
                </TransitionGroup>
            </template>
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
