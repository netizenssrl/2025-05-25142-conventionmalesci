import { create } from 'zustand';
const initialStatus = {
    participants: []
};

export const useParticipantStore = create((set, get) => ({
    ...initialStatus,

    resetStatus: () => set(initialStatus),
    getParticipants: () => get().participants,
    createParticipant: (participant) => 
        set( state => ({
            participants: [participant, ...state.participants]
        })),
    updateParticipant: (updatedParticipant) =>
        set( state => ({
            participants: state.participants.map(participant => participant.sEmail === updatedParticipant.sEmail ? updatedParticipant : participant)
        }),
    ),        
    deleteParticipant: (participantIds) =>
        set( state => ({
            participants: state.participants.filter(participant => !participantIds.includes(participant.id))
        }),
    ),
    setParticipants: (participants) => 
        set( state => ({
            participants
        })),
}));