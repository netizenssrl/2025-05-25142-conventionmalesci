"use client";

// import hooks
import { useState, useEffect } from "react";

// import nextui components
import { Alert, Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Select, SelectItem, Form, Switch } from "@nextui-org/react";

// import stores
import { useRoomStore } from "@/stores/room";
import { useTeamStore } from "@/stores/team";
import { useParticipantStore } from "@/stores/participant";

export default function EditParticipantModal({ isOpen, onClose, confirmAction, title, modalError, setModalError, selectedParticipantsKeys }) {
    const rooms = useRoomStore((state) => state.rooms);
    const teams = useTeamStore((state) => state.teams);
    const participants = useParticipantStore((state) => state.participants);

    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(new Set([]));
    const [selectedRoom, setSelectedRoom] = useState(new Set([]));
    const [bTeamPointsEnabled, setTeamPointsEnabled] = useState(true);
    const [bRoomPointsEnabled, setRoomPointsEnabled] = useState(true);

    useEffect(() => {
        if (selectedParticipantsKeys.size === 1 && isOpen) {
            const selectedParticipantId = parseInt(Array.from(selectedParticipantsKeys)[0]);
            const participant = participants.find((participant) => participant.id === selectedParticipantId);
            setSelectedParticipant(participant);
            setSelectedTeam(new Set([participant.teamId?.toString()]));
            setSelectedRoom(new Set([participant.roomId?.toString()]));
            setTeamPointsEnabled(participant.bTeamPointsEnabled);
            setRoomPointsEnabled(participant.bRoomPointsEnabled);
        }
        else {
            setSelectedParticipant(null);
            setSelectedTeam(new Set([]));
            setSelectedRoom(new Set([]));
        }
    }, [selectedParticipantsKeys, isOpen, participants]);

    const handleClose = () => {
        setModalError(null);
        onClose();
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        formData.id = selectedParticipant.id;
        const selectedRoomId = selectedRoom.size > 0 ? parseInt(Array.from(selectedRoom)[0]) : "all";
        const selectedTeamId = selectedTeam.size > 0 ? parseInt(Array.from(selectedTeam)[0]) : "all";
        const fullData = { ...formData, bTeamPointsEnabled, bRoomPointsEnabled, roomId: selectedRoomId, teamId: selectedTeamId };
        await confirmAction(fullData);
    };

    return (
        <Modal isOpen={isOpen} size="xl" onClose={handleClose}>
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    {
                        selectedParticipant && (
                            <Form onSubmit={onSubmit} className="block" validationBehavior="native">
                                <Input readOnly label="Email" name="sEmail" type="email" className="mb-4" size="sm" defaultValue={selectedParticipant.sEmail} />
                                <div className="flex gap-4 mb-4">
                                    <Input label="First Name" name="sFirstName" type="text" size="sm" defaultValue={selectedParticipant?.sFirstName} />
                                    <Input label="Last Name" name="sLastName" type="text" size="sm" defaultValue={selectedParticipant?.sLastName} />
                                </div>
                                <div className="flex gap-4 mb-8">
                                    <Select label="Team" name="teamId" className="w-full" size="sm" selectedKeys={selectedTeam} onSelectionChange={setSelectedTeam}>
                                        {teams.map((team) => (
                                            <SelectItem key={team.id}>{team.sName}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select label="Room" name="roomId" className="w-full" size="sm" selectedKeys={selectedRoom} onSelectionChange={setSelectedRoom}>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.id}>{room.sName}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                {modalError && <div className="mb-8"><Alert color="danger" title={modalError} /></div>}
                                <div className="flex justify-between mb-4">
                                    <div className="flex gap-4">
                                        <Switch isSelected={bTeamPointsEnabled} name="bTeamPointsEnabled" size="sm" onValueChange={setTeamPointsEnabled}>Team points</Switch>
                                        <Switch isSelected={bRoomPointsEnabled} name="bRoomPointsEnabled" size="sm" onValueChange={setRoomPointsEnabled}>Room points</Switch>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button onPress={onClose} color="default" variant="flat">Cancel</Button>
                                        <Button type="submit" color="primary">Edit</Button>
                                    </div>
                                </div>
                            </Form>
                        )
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}