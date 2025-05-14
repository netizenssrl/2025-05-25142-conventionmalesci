export const metadata = {
    title: "Dashboard | Connessi al futuro",
    robots: "noindex, nofollow",
};

import Dashboard from "./Dashboard";


// import socket provider in order to listen to socket events
import StatusSocketProvider from "@/components/logic/StatusSocketProvider";
import QuestionsSocketProvider from "@/components/logic/QuestionsSocketProvider";
import VotingSessionsSocketProvider from "@/components/logic/VotingSessionsSocketProvider";

// import actions
import { getQuestionsByRoom } from "@/actions/question";
import { getVotingSessionsByRoom } from "@/actions/votingsession";
import { getStatusByRoomId } from "@/actions/status";


export default async function Page({ params }) {
    const { room } = await params;
    const roomId = room !== "all" ? room : null;
    const questions = await getQuestionsByRoom(roomId);
    const votingSessions = await getVotingSessionsByRoom(roomId);
    const status = await getStatusByRoomId(roomId, false);
    return (
        <StatusSocketProvider initialStatus={status}>
            <QuestionsSocketProvider initialQuestions={questions}>
                <VotingSessionsSocketProvider initialVotingSessions={votingSessions}>
                    <Dashboard />
                </VotingSessionsSocketProvider>
            </QuestionsSocketProvider>
        </StatusSocketProvider>
    );
}