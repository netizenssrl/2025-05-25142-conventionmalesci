import { create } from 'zustand';

const initialStatus = {
    socket: {
        instance: null,
        bConnected: false,
        room: null
    }
};
export const useSocketStore = create((set, get) => ({
    ...initialStatus,
    resetStatus: () => set(initialStatus),
    getSocket: () => get().socket.instance,
    getConnectionStatus: () => get().socket.bConnected,
    getRoom: () => get.socket.room,
    setSocket: (socketInstance) =>
        set( state => ({
            socket: { ...state.socket, instance: socketInstance },
        })),
    setConnectionStatus: (bConnected) =>
        set( state => ({
            socket: {...state.socket, bConnected}
        })),
    setRoom: (room) => 
        set( state => ({
            socket: {...state.socket, room}
        })),
}));