"use client";
import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import {useSocketStore} from "@/stores/socket";

// import socket constants
import { SOCKET_TARGETS } from "@/libs/socket";


export default function MainSocketProvider({ children, room }) {
    const setSocket = useSocketStore((state) => state.setSocket);
    const setConnectionStatus = useSocketStore((state) => state.setConnectionStatus);
    useEffect(() => {
        const socketInstance = io(`/${SOCKET_TARGETS.ADMIN}`, {
            path: "/api/socket",
            addTrailingSlash: false,
            query:{
                room: room
            },
        });

        socketInstance.on("connect", () => {
            console.log("Connected");
            setConnectionStatus(true);
        });
        socketInstance.on("disconnect", () => {
            console.log("Disconnected");
            setConnectionStatus(false);
        });
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, [setSocket, setConnectionStatus, room]);

    return <>{children}</>;
};
