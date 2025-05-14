import { create } from 'zustand';
const initialStatus = {
    votingSessions: []
};
export const useVotingSessionStore = create((set, get) => ({
    ...initialStatus,
    resetStatus: () => set(initialStatus),
    getVotingSessions: () => get().votingSessions,
    getVotingSessionsByQuestionId: (questionId) => 
        get().votingSessions.filter(votingSession => votingSession.questionId === questionId),
    setVotingSessions: (votingSessions) => 
        set( state => ({
            votingSessions
        })),
    startVotingSession: (votingSession) =>
        set( state => ({
            votingSessions: [
                { ...votingSession, participantAnswers: [] },
                ...state.votingSessions
            ],
        }),
    ),
    stopVotingSession: (updatedVotingSession) =>
        set( state => ({
            votingSessions: state.votingSessions.map(vs =>{
                if(vs.id === updatedVotingSession.id){
                    return {
                        ...vs,
                        ...updatedVotingSession,
                        participantAnswers: vs.participantAnswers
                    };
                }
                return vs;
            })
        }),
    ),
    addParticipantAnswer: (participantAnswer) => 
        set( state => ({
            votingSessions: state.votingSessions.map(votingSession => {
                if(votingSession.id === participantAnswer.votingSessionId) {
                    return {
                        ...votingSession,
                        participantAnswers: [participantAnswer, ...votingSession.participantAnswers]
                    }
                }
                return votingSession;
            })
        }),
    )
}));