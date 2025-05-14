export const metadata = {
    title: "Participants | Connessi al futuro",
    robots: "noindex, nofollow",
};

import Participants from "./Participants";
import ParticipantsSocketProvider from "@/components/logic/ParticipantsSocketProvider";

import { getParticipantsByRoom } from "@/actions/participant";

export default async function Page({ params}) {
    const { room } = await params;
    const roomId = room !== "all" ? room : null;
    const participants = await getParticipantsByRoom(roomId);
    return(
        <ParticipantsSocketProvider initialParticipants={participants}>
            <Participants />
        </ParticipantsSocketProvider>
        
    );
}