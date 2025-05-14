"use client";

// import hooks
import { useEffect } from "react";

// import socket constants
import { SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";

// import stores
import { useSocketStore } from "@/stores/socket";
import { useQuestionStore } from "@/stores/question";

export default function QuestionsSocketProvider({ children, initialQuestions }) {
    const setQuestions = useQuestionStore((state) => state.setQuestions);
    
    const socketStore = useSocketStore();

    useEffect(() => {
        setQuestions(initialQuestions);
    }, [initialQuestions, setQuestions]);

    useEffect(() => {
        const socket = socketStore.getSocket();
        if(!socketStore.socket.bConnected || !socket) return;

       
        return () => {
        }

    }, [socketStore.socket.bConnected, socketStore]);

    return <>{children}</>;
}