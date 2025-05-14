"use client";

// import hooks
import { useEffect } from "react";

// import socket constants
import { SOCKET_EVENTS} from "@/libs/socket";

// import stores
import { useSocketStore } from "@/stores/socket";
import { useStatusStore } from "@/stores/status";

export default function StatusSocketProvider({ children, initialStatus }) {

    const setStatus = useStatusStore((state) => state.setStatus);
    const resetStatus = useStatusStore((state) => state.resetStatus);
    const socketStore = useSocketStore();

    useEffect(() => {
        if(initialStatus){
            setStatus(initialStatus);
        }
    }, [initialStatus, setStatus]);
    useEffect(() => {
        const socket = socketStore.getSocket();
        if (!socketStore.socket.bConnected || !socket) return;

        socket.on(SOCKET_EVENTS.STATUS.SET, (status) => {
            setStatus(status);
        });
        socket.on(SOCKET_EVENTS.STATUS.RESET, () => {
            resetStatus();
        });
        
        return () => {
            socket.off(SOCKET_EVENTS.STATUS.SET);
            socket.off(SOCKET_EVENTS.STATUS.RESET);
        };
    }, [socketStore.socket.bConnected, socketStore, setStatus, resetStatus]);

    return <>{children}</>;
}