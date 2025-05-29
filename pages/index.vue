<script setup lang="js">
    const usePitDelta = ref(false);
    const pitDelta = ref(0);
    
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
        
        // Step 1: Deep copy and adjust timeDiffs with pit delta
        const adjustedPlayers = originalPlayers.map(player => ({
            ...player,
            adjustedTime: player.timeDiff - (player.pits * pitDelta.value)
        }));
        
        // Step 2: Sort players by adjusted time (lowest = leading)
        adjustedPlayers.sort((a, b) => a.adjustedTime - b.adjustedTime);
        
        // Step 3: Recalculate timeDiffs from new leader
        const leaderTime = adjustedPlayers[0].adjustedTime;
        return adjustedPlayers.map(player => ({
            ...player,
            timeDiff: player.adjustedTime - leaderTime
        }));
    });
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