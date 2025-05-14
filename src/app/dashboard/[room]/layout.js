import Providers from "@/providers";

// import custom components
import Header from "@/components/ui/blocks/partials/Header";

// import loader to set server data to store
import RoomsLoader from "@/components/logic/RoomsLoader";
import TeamsLoader from "@/components/logic/TeamsLoader";

// import socket provider in order to listen to socket events
import ParticipantsSocketProvider from "@/components/logic/ParticipantsSocketProvider";
import MainSocketProvider from "@/components/logic/MainSocketProvider";

// import actions
import { getRooms } from "@/actions/room";
import { getTeams } from "@/actions/team";

// import styles
import "@/styles/main.scss";

export const metadata = {
    title: "Connessi al futuro",
    robots: "noindex, nofollow",
};
export const dynamic = "force-dynamic";
export default async function RootLayout({ children, params }) {

    const { room } = await params;
    const roomId = room !== "all" ? room : null;
    // call server action to get all data
    const rooms = await getRooms();
    const teams = await getTeams();

    return (
        <html lang="en" className="light">
            <head>
                <link rel="icon" href="/favicon.png" type="image/png" />
            </head>
            <body>
                <Providers>
                    <MainSocketProvider room={room}>
                        <RoomsLoader initialRooms={rooms} roomId={roomId} />
                        <TeamsLoader initialTeams={teams} />
                        <Header room={room} />
                        <main className="py-5 2xl:py-10 px-3 2xl:px-0">
                            <div className="2xl:container">
                                {children}
                            </div>
                        </main>
                    </MainSocketProvider>
                </Providers>
            </body>
        </html>
    );
}