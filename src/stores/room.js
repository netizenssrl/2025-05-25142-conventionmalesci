import { create } from 'zustand';

const initialStatus = {
    rooms: [],
    currentRoomId: null,
};

export const useRoomStore = create(
    (set, get) => ({
        ...initialStatus,
        resetStatus: () => set(initialStatus),
        getRooms: () => get().rooms,
        setRooms: (rooms) =>
            set((state) => ({
                rooms,
            })),
        setCurrentRoomId: (currentRoomId) =>
            set((state) => ({
                currentRoomId,
            })),
        getCurrentRoomId: () => get().currentRoomId,
    })
);