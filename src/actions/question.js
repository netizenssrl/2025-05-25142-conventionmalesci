"use server";
import prisma from '@/libs/prisma';
import { emitSocketEvent, SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";
export const getQuestionsByRoom = async (roomId) => {
    try {
        const condition = roomId ? {
           OR: [
            {
                roomQuestions: {
                    some: {
                        roomId: parseInt(roomId)
                    }
                }
            },
            {
                roomQuestions: {
                    none: {}
                }
            }
           ]
        } : {};
        const questions = await prisma.question.findMany({
            where: condition,
            include: {
                answers: true,
                roomQuestions: {
                    include: {
                        room: true
                    }
                }
            },
            orderBy: {
                iDefaultOrder: 'asc'
            }
        });
        return questions;
    }
    catch (error) {
        throw new Error("Error fetching questions");
    }
}