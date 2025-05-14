import { create } from 'zustand';
const initialStatus = {
    questions: [],
};
export const useQuestionStore = create((set, get) => ({
    ...initialStatus,
    resetStatus: () => set(initialStatus),
    getQuestions: () => get().questions,
    setQuestions: (questions) => 
        set( state => ({
            questions
        })),
}));