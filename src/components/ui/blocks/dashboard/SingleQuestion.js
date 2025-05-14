"use client";

// import hooks
import { use, useEffect, useState } from "react";

// import nextui components
import { Button, Input} from "@nextui-org/react";

// import custom ui components
import VotingSessionsTable from "./VotingSessionsTable";
import VotingSessionChart from "./VotingSessionChart";

// import store
import { useStatusStore } from "@/stores/status";
import { useRoomStore } from "@/stores/room";
import { useVotingSessionStore } from "@/stores/votingSession";

// import action
import { setStatus } from "@/actions/status";
import { startVotingSession, stopVotingSession, setTeamsPoints, setRoomsPoints } from "@/actions/votingsession";

import { AVAILABLE_COMMANDS } from "@/libs/socket";

export default function DashboardSingleQuestion({ question, selectedTargets }) {
    const status = useStatusStore((state) => state.status);
    const currentRoomId = useRoomStore((state) => state.currentRoomId);
    const votingSessions = useVotingSessionStore((state) => state.votingSessions);
    const getVotingSessionsByQuestionId = useVotingSessionStore((state) => state.getVotingSessionsByQuestionId);
    
    const [filteredVotingSessions, setFilteredVotingSessions] = useState([]);
    const [selectedVotingSessionKeys, setSelectedVotingSessionKeys] = useState(new Set([]));
    const [participantAnswers, setParticipantAnswers] = useState([]);

    const [timerSeconds, setTimerSeconds] = useState(question.iTimerSeconds);
    const [score, setScore] = useState(question.iScore);
    useEffect(() => {
        const tempFilteredVotingSessions = getVotingSessionsByQuestionId(question.id);
        setFilteredVotingSessions(tempFilteredVotingSessions);
        if(tempFilteredVotingSessions && tempFilteredVotingSessions.length > 0){
            setSelectedVotingSessionKeys(new Set([tempFilteredVotingSessions[0].id.toString()]));
        }
        else{
            setSelectedVotingSessionKeys(new Set([]));
        }
        console.log("question", question);
    }, [votingSessions, question.id, getVotingSessionsByQuestionId]);

    useEffect(() => {
        const selectedVotingSessionId = parseInt(Array.from(selectedVotingSessionKeys)[0]);
        const tempParticipantAnswers = filteredVotingSessions.find(votingSession => votingSession.id === selectedVotingSessionId)?.participantAnswers;
        setParticipantAnswers(tempParticipantAnswers);
    }, [filteredVotingSessions, selectedVotingSessionKeys]);

    const handlePressBtn = async (command) => {
        const data = { ...status };
        const selectedVotingSessionId = parseInt(Array.from(selectedVotingSessionKeys)[0]);
        data.currentQuestionId = question.id;
        data.iScore = null;
        data.iTimerSeconds = null;
        if(parseInt(score) !== question.iScore){
            data.iScore = parseInt(score);
        }
        if(parseInt(timerSeconds) !== question.iTimerSeconds){
            data.iTimerSeconds = parseInt(timerSeconds);
        }
        if (selectedTargets.has("participant")) data.sActiveCommandParticipant = command;
        if (selectedTargets.has("screen")) data.sActiveCommandScreen = command;
        switch (command) {
            case AVAILABLE_COMMANDS.START_SESSION:
                const startedVotingSession = await startVotingSession(question.id);
                data.currentVotingSessionId = startedVotingSession.id;
            break;
            case AVAILABLE_COMMANDS.STOP_SESSION:
                await stopVotingSession(selectedVotingSessionId);
            break;
            case AVAILABLE_COMMANDS.CORRECT_ANSWER:
            case AVAILABLE_COMMANDS.TEAM_RESULTS:
            case AVAILABLE_COMMANDS.ROOM_RESULTS:
                data.currentVotingSessionId = selectedVotingSessionId;
            break;
            case AVAILABLE_COMMANDS.TEAM_POINTS:
                await setTeamsPoints(selectedVotingSessionId, parseInt(score));
            break;
            case AVAILABLE_COMMANDS.ROOM_POINTS:
                await setRoomsPoints(selectedVotingSessionId, parseInt(score));
            break;
        }
        await setStatus(data, Array.from(selectedTargets), currentRoomId);
    };
    return (
        <div className="">
            <div className="flex mb-5 items-center">
                <div className="w-5/12">
                    <p>{question.sText}</p>
                </div>
                <div className="w-7/12 flex gap-4 justify-end">
                    <Button
                        color={selectedVotingSessionKeys.size === 0 ? "default": "primary"}
                        className="btn-question"
                        onPress={() => handlePressBtn(AVAILABLE_COMMANDS.CORRECT_ANSWER)}
                        isDisabled={selectedVotingSessionKeys.size === 0}
                    >
                        Correct Answer
                    </Button>
                    {
                        !currentRoomId && (
                            <>
                                 <Button 
                                    color={selectedVotingSessionKeys.size === 0 ? "default": "primary"} 
                                    className="btn-question" 
                                    onPress={() => handlePressBtn(AVAILABLE_COMMANDS.TEAM_RESULTS)}
                                    isDisabled={selectedVotingSessionKeys.size === 0}
                                >
                                    Team Results
                                </Button>
                                
                            </>
                            
                        )
                    }
                    <Button 
                        color={selectedVotingSessionKeys.size === 0 ? "default": "primary"} 
                        className="btn-question" 
                        onPress={() => handlePressBtn(AVAILABLE_COMMANDS.ROOM_RESULTS)}
                        isDisabled={selectedVotingSessionKeys.size === 0}
                    >
                        Room Results
                    </Button>
                    <Button 
                        color={selectedVotingSessionKeys.size === 0 ? "default": "primary"} 
                        className="btn-question" 
                        onPress={() => handlePressBtn(AVAILABLE_COMMANDS.TEAM_POINTS)}
                        isDisabled={selectedVotingSessionKeys.size === 0}
                    >
                        Team points
                    </Button>
                    <Button 
                        color={selectedVotingSessionKeys.size === 0 ? "default": "primary"} 
                        className="btn-question" 
                        onPress={() => handlePressBtn(AVAILABLE_COMMANDS.ROOM_POINTS)}
                        isDisabled={selectedVotingSessionKeys.size === 0}
                    >
                        Room points
                    </Button>
                </div>
            </div>
            <div className="flex gap-8 mb-4">
                <div className="w-5/12">
                    <div className="flex gap-4 mb-8">
                        <Input label="Timer (seconds)" type="number" value={timerSeconds} onValueChange={setTimerSeconds} size="sm" className="flex-1" />
                        <Input label="Score" type="number" value={score} onValueChange={setScore} size="sm" className="flex-1" />
                    </div>
                    <div className="flex gap-8 mb-8">
                        <Button color="primary" className="btn-question flex-1" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.QUESTION)}>Show</Button>
                        <Button color="success" className="btn-question flex-1" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.START_SESSION)}>Start</Button>
                        <Button 
                            color={selectedVotingSessionKeys.size === 0 ? "default": "danger"} 
                            className="btn-question flex-1" 
                            onPress={() => handlePressBtn(AVAILABLE_COMMANDS.STOP_SESSION)} 
                            isDisabled={selectedVotingSessionKeys.size === 0}
                        >
                            Stop
                        </Button>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-center">Voting Sessions</p>
                        <VotingSessionsTable votingSessions={filteredVotingSessions} selectedVotingSessionKeys={selectedVotingSessionKeys} setSelectedVotingSessionKeys={setSelectedVotingSessionKeys} />
                    </div>
                </div>
                <div className="w-7/12">
                    <VotingSessionChart participantAnswers={participantAnswers} question={question} />
                </div>
            </div>
        </div>
    );
}