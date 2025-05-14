// crea una lista di costanti che rappresentano i nomi degli eventi che possono essere emessi o ricevuti
export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    PARTICIPANT: {
        CREATED: "participant:created",
        UPDATED: "participant:updated",
        DELETED: "participant:deleted"
    },
    PARTICIPANT_ANSWER: {
        CREATED: "participant_answer:created",
    },
    TWEET: {
        CREATED: "tweet:created",
        UPDATED: "tweet:updated",
        DELETED: "tweet:deleted"
    },
    STATUS: {
        SET: "status:set",
        RESET: "status:reset"
    },
    VOTINGSESSION: {
        CREATED: "votingsession:created",
        STOPPED: "votingsession:stopped",
        DELETED: "votingsession:deleted"
    }
};
export const SOCKET_TARGETS = {
    ADMIN: "admin",
    PARTICIPANT: "participant",
    SCREEN: "screen"
};
export const AVAILABLE_COMMANDS = {
    LOGIN: "Login",
    COVER: "Cover",
    QRCODE: "QR Code",
    SURVEY: "Survey",
    QUESTION: "Question",
    START_SESSION: "Start Session",
    STOP_SESSION: "Stop Session",
    CORRECT_ANSWER: "Correct Answer",
    TEAM_RESULTS: "Team Results",
    ROOM_RESULTS: "Room Results",
    TEAM_POINTS: "Team Points",
    ROOM_POINTS: "Room Points",
    PARTIAL_RANKING_TEAMS: "Partial Ranking Teams",
    PARTIAL_RANKING_ROOMS: "Partial Ranking Rooms",
    FINAL_RANKING_TEAMS: "Final Ranking Teams",
    FINAL_RANKING_ROOMS: "Final Ranking Rooms",
    RESET_STATUS_VOTING_SESSIONS: "Reset Status and Voting Sessions",
    RESET_TEAM_POINTS: "Reset Team Points",
    RESET_ROOM_POINTS: "Reset Room Points",
};

export const emitSocketEvent = (target, room, eventName, data) => {
    console.log(`Emitting event ${eventName} to room ${room} on target ${target}`);
    const targetNamespace = global.io?.of(`/${target}`);
    if (targetNamespace) {
        if(room && room !== "all"){
            targetNamespace.to(`room_${room}`).emit(eventName, data);
        }
        else{
            targetNamespace.emit(eventName, data);
        }
    }
}