import {PollPlayers} from "~/requests.js";

export const useStore = defineStore('cameraControl', {
    state: () => ({
        players: []
    }),

    getters: {
        getPlayers: (state) => state.players,
    },
})