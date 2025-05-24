import {PollPlayers} from "~/requests.js";

export const useStore = defineStore('cameraControl', {
    state: () => ({
        players: []
    }),

    getters: {
        getPlayers: (state) => state.players,
    },

    actions: {
        async pollPlayers() {
            try {
                this.players = await PollPlayers(useToast());
            } catch (e) {

            }
        },
    },
})