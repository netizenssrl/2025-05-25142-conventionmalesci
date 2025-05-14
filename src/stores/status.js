import { create } from 'zustand';

import { AVAILABLE_COMMANDS } from '@/libs/socket';

const initialStatus = {
    status: {
        sActiveCommandParticipant: AVAILABLE_COMMANDS.COVER,
        sActiveCommandScreen: AVAILABLE_COMMANDS.COVER,
        sSurveyLink: "",
        bQRCodeEnabled: true,
        bTweetEnabled: false,
    }
};
export const useStatusStore = create((set, get) => ({
    ...initialStatus,
    resetStatus: () => set(initialStatus),
    getStatus: () => get().status,
    setStatus: (status) => set({ status }),
}));