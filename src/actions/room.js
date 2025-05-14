"use server";
import prisma from '@/libs/prisma';
export const getRooms = async () => {
    return await prisma.room.findMany();
}
export const getRoomById = async (id) => {
    try {
        return await prisma.room.findUnique({
            where: {
                id: parseInt(id)
            }
        });
    }
    catch (error) {
        throw new Error("Error fetching room");
    }
}
export const getRoomsOrderedByScore = async () => {
    return await prisma.room.findMany({
        orderBy: {
            iScore: 'desc'
        }
    });
}
export const resetRoomScore = async () => {
    return await prisma.room.updateMany({
        data: {
            iScore: 0
        }
    });
}