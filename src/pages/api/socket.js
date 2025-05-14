import { Server } from 'socket.io';
import { SOCKET_TARGETS, SOCKET_EVENTS } from "@/libs/socket";
import { updateParticipant } from "@/actions/participant";
import { getRooms } from "@/actions/room";
export const config = {
    api: {
        bodyParser: false,
    },
};
export default async function handler(req, res) {
    if(!res.socket.server.io ) {
        console.log('Initializing Socket.io server...');
        const io = new Server(res.socket.server, {
            path: "/api/socket",
            addTrailingSlash: false,
        });
        const namespaces = [
            io.of(SOCKET_TARGETS.ADMIN),
            io.of(SOCKET_TARGETS.PARTICIPANT),
            io.of(SOCKET_TARGETS.SCREEN),
        ];
        const roomList = await getRooms();
        namespaces.forEach((namespace) => {
            namespace.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
                const room = socket.handshake.query.room;
                const participantId = socket.handshake.query.participantId ? parseInt(socket.handshake.query.participantId) : null;
                
                if(room && room !== "all") {
                    socket.join(`room_${room}`);
                }
                else{
                    for(const singleRoom of roomList) {
                        socket.join(`room_${singleRoom.id}`);
                    }
                }
                if(participantId) {
                    const data = {
                        id: participantId,
                        idSocket: socket.id,
                        dtmConnected: new Date(),
                        dtmDisconnected: null
                    };
                    await updateParticipant(data);

                    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
                        if(participantId) {
                            const data = {
                                id: participantId,
                                dtmDisconnected: new Date()
                            };
                            await updateParticipant(data);
                        }
                    });
                }
            });
        });
        res.socket.server.io = io;
        global.io = io;
    }
    else{
        console.log('Socket.io server already initialized');
    }
    res.end();
}