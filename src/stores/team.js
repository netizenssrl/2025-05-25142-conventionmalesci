import { create } from 'zustand';
const initialStatus = {
    teams: []
};

export const useTeamStore = create((set, get) => ({
    ...initialStatus,
    resetStatus: () => set(initialStatus),
    getTeams: () => get().teams,
    setTeams: (teams) =>
        set(state => ({
            teams
        }))
}));
