"use client";

// import hooks
import { useEffect } from "react";

// import socket constants
import { SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";

// import stores
import { useSocketStore } from "@/stores/socket";
import { useVotingSessionStore } from "@/stores/votingSession";

export default function VotingSessionsSocketProvider({ children, initialVotingSessions }) {
    const setVotingSessions = useVotingSessionStore((state) => state.setVotingSessions);
    const startVotingSession = useVotingSessionStore((state) => state.startVotingSession);
    const stopVotingSession = useVotingSessionStore((state) => state.stopVotingSession);
    const addParticipantAnswer = useVotingSessionStore((state) => state.addParticipantAnswer);
    const socketStore = useSocketStore();

    useEffect(() => {
        setVotingSessions(initialVotingSessions);
    }, [initialVotingSessions, setVotingSessions]);

    useEffect(() => {
        const socket = socketStore.getSocket();
        if(!socketStore.socket.bConnected || !socket) return;

        socket.on(SOCKET_EVENTS.VOTINGSESSION.CREATED, (votingSession) => {
            startVotingSession(votingSession);
        });
        socket.on(SOCKET_EVENTS.VOTINGSESSION.STOPPED, (votingSession) => {
            stopVotingSession(votingSession);
        });
        socket.on(SOCKET_EVENTS.PARTICIPANT_ANSWER.CREATED, (participantAnswer) => {
            addParticipantAnswer(participantAnswer);
        });
        socket.on(SOCKET_EVENTS.VOTINGSESSION.DELETED, () => {
            setVotingSessions([]);
        });
       
        return () => {
            socket.off(SOCKET_EVENTS.VOTINGSESSION.CREATED);
            socket.off(SOCKET_EVENTS.VOTINGSESSION.STOPPED);
            socket.off(SOCKET_EVENTS.PARTICIPANT_ANSWER.CREATED);
            socket.off(SOCKET_EVENTS.VOTINGSESSION.DELETED);
        }

    }, [socketStore.socket.bConnected, socketStore, setVotingSessions, startVotingSession, stopVotingSession, addParticipantAnswer]);

    return <>{children}</>;
}