"use client";

// import hooks
import { useEffect } from "react";

// import socket constants
import { SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";

// import stores
import { useSocketStore } from "@/stores/socket";
import { useParticipantStore } from "@/stores/participant";

export default function ParticipantsSocketProvider({ children, initialParticipants }) {
    const setParticipants = useParticipantStore((state) => state.setParticipants);
    const createParticipant = useParticipantStore((state) => state.createParticipant);
    const updateParticipant = useParticipantStore((state) => state.updateParticipant);
    const deleteParticipant = useParticipantStore((state) => state.deleteParticipant);
    const socketStore = useSocketStore();

    useEffect(() => {
        setParticipants(initialParticipants);
    }, [initialParticipants, setParticipants]);
    
    useEffect(() => {
        const socket = socketStore.getSocket();
        if(!socketStore.socket.bConnected || !socket) return;


        socket.on(SOCKET_EVENTS.PARTICIPANT.CREATED, (participant) => {
            createParticipant(participant);
        });
        socket.on(SOCKET_EVENTS.PARTICIPANT.UPDATED, (participant) => {
            updateParticipant(participant);
        });
        socket.on(SOCKET_EVENTS.PARTICIPANT.DELETED, (participantIds) => {
            deleteParticipant(participantIds);
        });
        //socket.on(SOCKET_EVENTS.PARTICIPANT.VOTE, )
        return () => {
            socket.off(SOCKET_EVENTS.PARTICIPANT.CREATED);
            socket.off(SOCKET_EVENTS.PARTICIPANT.UPDATED);
            socket.off(SOCKET_EVENTS.PARTICIPANT.DELETED);
        };
        

    }, [socketStore, socketStore.socket.bConnected, createParticipant, updateParticipant, deleteParticipant]);

    return <>{children}</>;
}