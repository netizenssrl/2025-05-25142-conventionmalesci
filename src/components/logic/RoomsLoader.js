"use client";

// import hooks
import { useEffect, useMemo } from "react";

// import stores
import { useRoomStore } from "@/stores/room";

export default function RoomsLoader({initialRooms, roomId}) {
    const setRooms = useRoomStore((state) => state.setRooms);
    const setCurrentRoomId = useRoomStore((state) => state.setCurrentRoomId);

    const isValidRoomId = useMemo(() => {
        return initialRooms.some((singleRoom) => singleRoom.id === parseInt(roomId));
    }, [initialRooms, roomId]);

    useEffect(() => {
        setRooms(initialRooms);
        setCurrentRoomId(isValidRoomId ? parseInt(roomId) : null);
    }, [initialRooms, isValidRoomId, roomId, setRooms, setCurrentRoomId]);

    return null;
}