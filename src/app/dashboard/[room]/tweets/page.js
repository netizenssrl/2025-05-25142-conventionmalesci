export const metadata = {
    title: "Tweets | Connessi al futuro",
    robots: "noindex, nofollow",
};

// import main page componente
import Tweets from "./Tweets";
import TweetsSocketProvider from "@/components/logic/TweetsSocketProvider";
import ParticipantsSocketProvider from "@/components/logic/ParticipantsSocketProvider";

// import actions
import { getTweetsByRoomId } from "@/actions/tweet";
import { getParticipantsByRoom } from "@/actions/participant";

export default async function Page({ params}) {
    const { room } = await params;
    const roomId = room !== "all" ? room : null;
    const tweets = await getTweetsByRoomId(roomId);
    const participants = await getParticipantsByRoom(roomId);
    return(
        <ParticipantsSocketProvider initialParticipants={participants}>
            <TweetsSocketProvider initialTweets={tweets}>
                <Tweets />
            </TweetsSocketProvider>
        </ParticipantsSocketProvider>
       
    );
}