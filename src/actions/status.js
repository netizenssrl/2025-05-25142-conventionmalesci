"use server";
import prisma from '@/libs/prisma';
import { emitSocketEvent, SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";

export const getStatusByRoomId = async (roomId, bFullStatus) => {
    try {
        // extract last status where roomId is null
        const statusWithoutRoom = await prisma.status.findFirst({
            where: {
                statusRooms: {
                    none: {
                    }
                }
            },
            include: {
                currentQuestion: {
                    include: {
                        answers: true,
                    },
                }
            },
            orderBy: {
                dtmCreated: 'desc'
            }
        });
        if( !roomId ) {
            if(statusWithoutRoom) {
                const { id, dtmCreated, currentQuestion, ...cleanedStatusWithoutRoom } = statusWithoutRoom;
                return bFullStatus ? statusWithoutRoom : cleanedStatusWithoutRoom;
            }
            else{
                return null;
            }
        }
        else{
            // extract last status where roomId is null or roomId is equal to the given roomId
            const statusWithRoom = await prisma.status.findFirst({
                where: {
                    statusRooms: {
                        some: {
                            roomId : parseInt(roomId)
                        }
                    }
                },
                include: {
                    currentQuestion: {
                        include: {
                            answers: true,
                        },
                    }
                },
                orderBy: {
                    dtmCreated: 'desc'
                }
            });
            // Compare dtmCreated timestamps and return the most recent status
            if (statusWithRoom && statusWithoutRoom) {
                const isStatusWithRoomMoreRecent = new Date(statusWithRoom.dtmCreated) > new Date(statusWithoutRoom.dtmCreated);
                if (isStatusWithRoomMoreRecent) {
                    const { id, dtmCreated, currentQuestion, ...cleanedStatusWithRoom } = statusWithRoom;
                    return bFullStatus ? statusWithRoom : cleanedStatusWithRoom;
                } else {
                    const { id, dtmCreated, currentQuestion, ...cleanedStatusWithoutRoom } = statusWithoutRoom;
                    return bFullStatus ? statusWithoutRoom : cleanedStatusWithoutRoom;
                }
            } else if (statusWithRoom) {
                const { id, dtmCreated, currentQuestion, ...cleanedStatusWithRoom } = statusWithRoom;
                return bFullStatus ? statusWithRoom : cleanedStatusWithRoom;
            } else if (statusWithoutRoom) {
                const { id, dtmCreated, currentQuestion, ...cleanedStatusWithoutRoom } = statusWithoutRoom;
                return bFullStatus ? statusWithoutRoom : cleanedStatusWithoutRoom;
            } else {
                return null;
            }
        }
    }
    catch(error) {
        throw new Error("Error fetching status");
    }
}
export const setStatus = async (data, selectedTargets, roomId) => {
    try {
        const newStatus = await prisma.status.create({
            data: {
                ...data,
                dtmCreated: new Date(),
            },
            include: {
                currentQuestion: {
                    include: {
                        answers: true,
                    },
                }
            }
        });
        const { id, dtmCreated, currentQuestion, ...cleanedStatus } = newStatus;
        if(roomId) {
            await prisma.statusRooms.create({
                data: {
                    statusId: newStatus.id,
                    roomId
                }
            });
        }
        emitSocketEvent(SOCKET_TARGETS.ADMIN, roomId, SOCKET_EVENTS.STATUS.SET, data);
        for(const target of selectedTargets){
            emitSocketEvent(target, roomId, SOCKET_EVENTS.STATUS.SET, newStatus);
        }
    }
    catch(error) {
        throw new Error("Error setting status");
    }
}
export const resetStatus = async () => {
    try {
        await prisma.statusRooms.deleteMany();
        await prisma.status.deleteMany();
        await prisma.$executeRawUnsafe(`ALTER TABLE status AUTO_INCREMENT = 1`);
        emitSocketEvent(SOCKET_TARGETS.ADMIN, null, SOCKET_EVENTS.STATUS.RESET, null);
        emitSocketEvent(SOCKET_TARGETS.PARTICIPANT, null, SOCKET_EVENTS.STATUS.RESET, null);
        emitSocketEvent(SOCKET_TARGETS.SCREEN, null, SOCKET_EVENTS.STATUS.RESET, null);
    }
    catch(error) {
        throw new Error("Error resetting status");
    }
}