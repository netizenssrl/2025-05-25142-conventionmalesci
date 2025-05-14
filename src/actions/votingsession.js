"use server";
import prisma from '@/libs/prisma';
import { emitSocketEvent, SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";

export const getVotingSessionsByRoom = async (roomId) => {
    try {
        const condition = roomId ? {
            OR: [
                {
                    roomQuestions: {
                        some: {
                            roomId: parseInt(roomId),
                        },
                    },
                },
                {
                    roomQuestions: {
                        none: {}, // Sessioni senza riferimento a roomId
                    },
                },
            ]            
        } : {};
        const votingSessions = await prisma.votingSession.findMany({
            where: {
                question: condition
            },
            include: {
                question: {
                    include: {
                        answers: true
                    }
                },
                participantAnswers: {
                    include: {
                        participant: true,
                        answer: true
                    }
                }
            },
            orderBy: {
                dtmStarted: 'desc'
            }
        });
        return votingSessions;
    }
    catch (error) {
        throw new Error("Error fetching voting sessions");
    }
};
export const startVotingSession = async (questionId, roomId) => {
    try {
        const votingSession = await prisma.votingSession.create({
            data: {
                questionId,
                dtmStarted: new Date()
            }
        });
        emitSocketEvent(SOCKET_TARGETS.ADMIN, roomId, SOCKET_EVENTS.VOTINGSESSION.CREATED, votingSession);
        return votingSession;
    }
    catch (error) {
        throw new Error("Error starting voting session");
    }
};
export const stopVotingSession = async (votingSessionId, roomId) => {
    try {
        const votingSession = await prisma.votingSession.update({
            where: {
                id: votingSessionId
            },
            data: {
                dtmStopped: new Date()
            }
        });
        emitSocketEvent(SOCKET_TARGETS.ADMIN, roomId, SOCKET_EVENTS.VOTINGSESSION.STOPPED, votingSession);
        return votingSession;
    }
    catch (error) {
        throw new Error("Error stopping voting session");
    }
};
export const getResults = async (votingSessionId, bTeamPointsEnabled, bRoomPointsEnabled, roomId) => {
    try {
        // if bTeamPointsEnabled consider only participants with bTeamPointsEnabled
        // if bRoomPointsEnabled consider only participants with bRoomPointsEnabled
        const votingSession = await prisma.participantAnswer.findMany({
            where: {
                votingSessionId: parseInt(votingSessionId),
                ...(bTeamPointsEnabled && { participant: { bTeamPointsEnabled: true } }),
                ...(bRoomPointsEnabled && { participant: { bRoomPointsEnabled: true } }),
                ...(roomId !== "all" && { participant: { roomId: parseInt(roomId) } }),
            },
            include: {
                participant: true,
                answer: true
            }
        });
        return votingSession;
    }
    catch (error) {
        throw new Error("Error fetching teams results");
    }
};
export const setTeamsPoints = async (votingSessionId, iScore) => {
    try{
        // set points to each team depending on the correct answers
        const votingSession = await prisma.participantAnswer.findMany({
            where: {
                votingSessionId: parseInt(votingSessionId),
                participant: { bTeamPointsEnabled: true },
            },
            include: {
                participant: {
                    include: {
                        team: true
                    }
                },
                answer: true
            }
        });

        if(votingSession.length === 0) return;

        const teamAnswersCount = votingSession.reduce((acc, participantAnswer) => {
            const teamId = participantAnswer.participant.teamId;
            const bCorrect = participantAnswer.answer.bCorrect;
            const answerCount = {bCorrect: 0, total: 0};
            if(!acc[teamId]) acc[teamId] = answerCount;
            acc[teamId].total++;
            if(bCorrect) acc[teamId].bCorrect++;          
            return acc;
        }, {});

        // Calculate normalized scores for each team
        const teamScores = Object.keys(teamAnswersCount).map((teamId) => {
            const correctAnswers = teamAnswersCount[teamId].bCorrect;
            const totalParticipants = teamAnswersCount[teamId].total || 1; // Avoid division by 0
            const percentage = correctAnswers / totalParticipants; // Percentage of correct answers
            const normalizedScore = Math.round(iScore * percentage); // Normalized score
            return { teamId: parseInt(teamId), score: normalizedScore };
        });

        // Update each team's score in the database
        const updatePromises = teamScores.map(({ teamId, score }) =>
            prisma.team.update({
                where: { id: teamId },
                data: { iScore: { increment: score } },
            })
        );

        await Promise.all(updatePromises);

    }
    catch (error) {
        throw new Error("Error setting teams points");
    }
};

export const setRoomsPoints = async (votingSessionId, iScore) => {
    try {
        
        // set points to each room depending on the correct answers
        const votingSession = await prisma.participantAnswer.findMany({
            where: {
                votingSessionId: parseInt(votingSessionId),
                participant: { bRoomPointsEnabled: true }
            },
            include: {
                participant: {
                    include: {
                        room: true
                    }
                },
                answer: true
            }
        });

        if(votingSession.length === 0) return;

        const roomAnswersCount = votingSession.reduce((acc, participantAnswer) => {
            const roomId = participantAnswer.participant.roomId;
            const bCorrect = participantAnswer.answer.bCorrect;
            const answerCount = {bCorrect: 0, total: 0};
            if(!acc[roomId]) acc[roomId] = answerCount;
            acc[roomId].total++;
            if(bCorrect) acc[roomId].bCorrect++;      
            console.log("acc", acc);    
            return acc;
        }, {});

        // Calculate normalized scores for each room
        const roomScores = Object.keys(roomAnswersCount).map((roomId) => {
            const correctAnswers = roomAnswersCount[roomId].bCorrect;
            const totalParticipants = roomAnswersCount[roomId].total || 1; // Avoid division by 0
            const percentage = correctAnswers / totalParticipants; // Percentage of correct answers
            const normalizedScore = Math.round(iScore * percentage); // Normalized score
            return { roomId: parseInt(roomId), score: normalizedScore };
        });

        // Update each room's score in the database
        const updatePromises = roomScores.map(({ roomId, score }) =>
            prisma.room.update({
                where: { id: roomId },
                data: { iScore: { increment: score } },
            })
        );

        await Promise.all(updatePromises);

    }
    catch (error) {
        throw new Error("Error setting rooms points");
    }
};

export const deleteAllVotingSessions = async () => {
    try {
        await prisma.participantAnswer.deleteMany();
        await prisma.votingSession.deleteMany();
        await prisma.$executeRawUnsafe(`ALTER TABLE voting_sessions AUTO_INCREMENT = 1`);
        emitSocketEvent(SOCKET_TARGETS.ADMIN, null, SOCKET_EVENTS.VOTINGSESSION.DELETED);
    }
    catch (error) {
        throw new Error("Error deleting voting sessions");
    }
}