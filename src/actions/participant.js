"use server";
import prisma from '@/libs/prisma';
import { emitSocketEvent, SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";
export const getParticipants = async () => {
    try {
        const participants = await prisma.participant.findMany({
            include: {
                team: true,
                room: true
            }
        });
        return participants;
    }
    catch (error) {
        throw new Error("Error fetching participants");
    }
}

export const getParticipantsByRoom = async (roomId) => {
    try {
        const condition = roomId ? { roomId: parseInt(roomId) } : {};
        const participants = await prisma.participant.findMany({
            where: condition,
            include: {
                team: true,
                room: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        return participants;
    }
    catch (error) {
        throw new Error("Error fetching participants");
    }
}

export const loginParticipant = async (sEmail) => {
    try {
        const participant = await prisma.participant.findUnique({
            where: { sEmail }
        });
        if (!participant) {
            return null;
        }
        const updatedParticipant = await prisma.participant.update({
            where: {
                sEmail
            },
            data: {
                dtmLogin: new Date()
            },
            include: {
                team: true,
                room: true
            }
        });
        emitSocketEvent(SOCKET_TARGETS.ADMIN, null, SOCKET_EVENTS.PARTICIPANT.UPDATED, updatedParticipant);
        return updatedParticipant;
    }
    catch (error) {
        throw new Error("Error logging in participant");
    }
}
export const logoutParticipant = async (id) => {
    try{
        await prisma.participant.update({
            where: {
                id: parseInt(id)
            },
            data: {
                dtmLogout: new Date()
            }
        });
    }
    catch (error) {
        throw new Error("Error logging out participant");
    }
}
export const getParticipantById = async (id) => {
    try{
        const participant = await prisma.participant.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                team: true,
                room: true
            }
        });
        return participant;
    }
    catch(error){
        throw new Error("Error fetching participant");
    }
}
export const createParticipant = async (data) => {
    if(data.sEmail){
        const existingParticipant = await prisma.participant.findUnique({
            where: {
                sEmail: data.sEmail
            }
        });
        if (existingParticipant) {
            throw new Error("Participant already exists");
        }
    }
    
    try {
        const participant = await prisma.participant.create({
            data: {
                ...data
            },
            include: {
                team: true,
                room: true
            }
        });
        // emit socket event with all participants
        emitSocketEvent(SOCKET_TARGETS.ADMIN, null, SOCKET_EVENTS.PARTICIPANT.CREATED, participant);
    }
    catch (error) {
        throw new Error("Error creating participant");
    }
}

export const updateParticipant = async (data) => {
    const { roomId, teamId, ...rest } = data;
    try {
        const updateData = {
            ...rest
        };
        if(roomId){
            if(roomId === "all") {
                updateData.roomId = null;
            }
            else{
                updateData.roomId = parseInt(roomId);
            }
        }
        if(teamId){
            if(teamId === "all") {
                updateData.teamId = null;
            }
            else{
                updateData.teamId = parseInt(teamId);
            }
        }
        const updatedParticipant = await prisma.participant.update({
            where: {
                id: data.id
            },
            data: updateData,
            include: {
                team: true,
                room: true
            }
        });
        // emit socket event with all participants
        emitSocketEvent(SOCKET_TARGETS.ADMIN, null, SOCKET_EVENTS.PARTICIPANT.UPDATED, updatedParticipant);
    }
    catch (error) {
        throw new Error("Error editing participant");
    }
}

export const deleteParticipant = async (participantIds) => {
    try {
        await prisma.participant.deleteMany({
            where: {
                id: {
                    in: participantIds
                }
            }
        });

        // emit socket event
        emitSocketEvent(SOCKET_TARGETS.ADMIN, null, SOCKET_EVENTS.PARTICIPANT.DELETED, participantIds);
    }
    catch (error) {
        throw new Error("Error deleting participant");
    }
}
export const createParticipantAnswer = async (data) => {
    try {
        const { participantId, answerId, votingSessionId, roomId } = data;
        const currentDate = new Date();
        const participantAnswer = await prisma.participantAnswer.create({
            data: {
                participantId: parseInt(participantId),
                answerId: parseInt(answerId),
                votingSessionId: parseInt(votingSessionId),
                dtmVoted: currentDate
            }
        });
        // emit socket event
        emitSocketEvent(SOCKET_TARGETS.ADMIN, roomId, SOCKET_EVENTS.PARTICIPANT_ANSWER.CREATED, participantAnswer);
        return participantAnswer;
    }
    catch (error) {
        throw new Error("Error creating participant answer");
    }
}