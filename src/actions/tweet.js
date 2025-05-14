"use server";
import prisma from '@/libs/prisma';
import { emitSocketEvent, SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";

export const getTweets = async () => {
    return await prisma.tweet.findMany();
}

export const getTweetsByParticipantId = async (participantId) => {
    return await prisma.tweet.findMany({ where: { participantId: parseInt(participantId) }, orderBy: { dtmCreated: 'desc' } });
}

export const getTweetsByRoomId = async (roomId) => {
    const condition = roomId ? { participant: { roomId: parseInt(roomId) }} : {};
    const tweets = await prisma.tweet.findMany({
        where: condition,
        include: {
            participant: {
                include: {
                    room: true
                }
            }
        },
        orderBy: { dtmCreated: 'desc' }
    });
    return tweets;
}

export const createTweet = async (data) => {
    try{
        const {roomId, ...rest} = data;
        const currentDate = new Date();
        
        const tweet = await prisma.tweet.create({ 
            data: {
                ...rest,
                dtmCreated: currentDate,
                dtmApproved: rest.bApproved ? currentDate : null,
                dtmOnScreen: rest.bOnScreen ? currentDate : null,
            },
            include: {
                participant: {
                    include: {
                        room: true
                    }
                }
            } 
        });
        console.log("roomId", roomId, tweet.participant);
        emitSocketEvent(SOCKET_TARGETS.ADMIN, roomId ? roomId : tweet.participant.roomId, SOCKET_EVENTS.TWEET.CREATED, tweet);
        emitSocketEvent(SOCKET_TARGETS.SCREEN, roomId ? roomId : tweet.participant.roomId, SOCKET_EVENTS.TWEET.CREATED, tweet);
        return tweet;
    }
    catch(error) {
        throw new Error("Error creating tweet");
    }
}

export const deleteTweet = async (tweetIds) => {
    try {
        await prisma.tweet.deleteMany({
            where: {
                id: {
                    in: tweetIds
                }
            }
        });

        // emit socket event
        emitSocketEvent(SOCKET_TARGETS.ADMIN, null, SOCKET_EVENTS.TWEET.DELETED, tweetIds);
        emitSocketEvent(SOCKET_TARGETS.PARTICIPANT, null, SOCKET_EVENTS.TWEET.DELETED, tweetIds);
        emitSocketEvent(SOCKET_TARGETS.SCREEN, null, SOCKET_EVENTS.TWEET.DELETED, tweetIds);
    }
    catch (error) {
        throw new Error("Error deleting tweet");
    }
}

export const updateTweet = async (data) => {
    try{
        const {bApprovedEdited, bArchivedEdited, bOnScreenEdited, ...rest} = data;
        const currentDate = new Date();

        const dataApproved = (bApprovedEdited && rest.bApproved) ? {dtmApproved: currentDate} : {};
        const dataArchived = (bArchivedEdited && rest.bArchived) ? {dtmArchived: currentDate} : {};
        const dataOnScreen = (bOnScreenEdited && rest.bOnScreen) ? {dtmOnScreen: currentDate} : {};

        const tweet = await prisma.tweet.update({
            where: {
                id: data.id
            },
            data: {
                ...rest,
                ...dataApproved,
                ...dataArchived,
                ...dataOnScreen
            },
            include: {
                participant: {
                    include: {
                        room: true
                    }
                }
            }
        });

        emitSocketEvent(SOCKET_TARGETS.ADMIN, tweet.participant.roomId? tweet.participant.roomId : null, SOCKET_EVENTS.TWEET.UPDATED, tweet);
        emitSocketEvent(SOCKET_TARGETS.SCREEN, tweet.participant.roomId? tweet.participant.roomId : null, SOCKET_EVENTS.TWEET.UPDATED, tweet);
        return tweet;
    }
    catch(error) {
        throw new Error("Error editing tweet");
    }
}