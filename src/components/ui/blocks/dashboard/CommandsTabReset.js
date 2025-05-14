"use client";

// import hooks
import { useState } from "react";

// import nextui components
import { Card, CardBody, Button, CardHeader, Divider, useDisclosure } from "@nextui-org/react";

// import custom ui components
import ConfirmationModal from "@/components/ui/modals/common/ConfirmationModal";

// import store
import { useStatusStore } from "@/stores/status";
import { useRoomStore } from "@/stores/room";

// import action
import { setStatus, resetStatus } from "@/actions/status";
import { resetRoomScore } from "@/actions/room";
import { resetTeamsScore } from "@/actions/team";
import {deleteAllVotingSessions } from "@/actions/votingsession";

// import translations
import { AVAILABLE_COMMANDS } from "@/libs/socket";

export default function CommandsTabReset() {
    const [modalError, setModalError] = useState(null);
    const [resetCommand, setResetCommand] = useState(null);
    const useConfirmDisclosure = useDisclosure();

    const handleResetBtn = (command) => {
        setResetCommand(command);
        useConfirmDisclosure.onOpen();
    };
    const confirmDelete = async () => {
        try {
            switch (resetCommand) {
                case AVAILABLE_COMMANDS.RESET_TEAM_POINTS:
                    await resetTeamsScore();
                    break;
                case AVAILABLE_COMMANDS.RESET_ROOM_POINTS:
                    await resetRoomScore();
                    break;
                case AVAILABLE_COMMANDS.RESET_STATUS_VOTING_SESSIONS:
                    await resetStatus();
                    await deleteAllVotingSessions();
                    break;
            }
            useConfirmDisclosure.onClose();
            setModalError(null);
        }
        catch (error) {
            setModalError(error.message);
        }
    };

    return (
        <div className="flex gap-4 h-full">
            <Card shadow="sm" className="flex-1">
                <CardHeader className="text-sm justify-center font-semibold text-primary">DASHBOARD</CardHeader>
                <Divider />
                <CardBody className="p-4 flex flex-col gap-4 items-center">
                    <Button fullWidth color="primary" onPress={() => handleResetBtn(AVAILABLE_COMMANDS.RESET_STATUS_VOTING_SESSIONS)}>{AVAILABLE_COMMANDS.RESET_STATUS_VOTING_SESSIONS}</Button>
                </CardBody>
            </Card>
            <Card shadow="sm" className="flex-1">
                <CardHeader className="text-sm justify-center font-semibold text-primary">POINTS</CardHeader>
                <Divider />
                <CardBody className="p-4 flex flex-col gap-4 items-center">
                    <Button fullWidth color="primary" onPress={() => handleResetBtn(AVAILABLE_COMMANDS.RESET_TEAM_POINTS) }>{AVAILABLE_COMMANDS.RESET_TEAM_POINTS}</Button>
                    <Button fullWidth color="primary" onPress={() => handleResetBtn(AVAILABLE_COMMANDS.RESET_ROOM_POINTS)}>{AVAILABLE_COMMANDS.RESET_ROOM_POINTS}</Button>
                </CardBody>
            </Card>
            <div className="flex-1"></div>
             <ConfirmationModal
                isOpen={useConfirmDisclosure.isOpen}
                onClose={useConfirmDisclosure.onClose}
                confirmAction={confirmDelete}
                modalError={modalError}
                setModalError={setModalError}
                title="Confirm deletion"
                body="Are you sure you want to reset the selected data?"
            />
        </div>
    );
}