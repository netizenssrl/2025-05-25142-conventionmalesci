"use server";
import prisma from '@/libs/prisma';
export const getTeams = async () => {
    return await prisma.team.findMany();
}
export const getTeamsOrderedByScore = async () => {
    return await prisma.team.findMany({
        orderBy: {
            iScore: 'desc'
        }
    });
}
export const resetTeamsScore = async () => {
    return await prisma.team.updateMany({
        data: {
            iScore: 0
        }
    });
}