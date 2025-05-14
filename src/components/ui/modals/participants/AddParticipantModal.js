"use client";
import { useEffect, useState } from "react";
import { Alert, Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Select, SelectItem, Form, Switch } from "@nextui-org/react";

import { regexEmail } from "@/libs/utils";

import { useRoomStore } from "@/stores/room";
import { useTeamStore } from "@/stores/team";


export default function AddParticipantModal({ isOpen, onClose, confirmAction, title, modalError, setModalError }) {
    const rooms = useRoomStore((state) => state.rooms);
    const currentRoomId = useRoomStore((state) => state.currentRoomId);
    const teams = useTeamStore((state) => state.teams);

    const [bTeamPointsEnabled, setTeamPointsEnabled] = useState(true);
    const [bRoomPointsEnabled, setRoomPointsEnabled] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(new Set([]));
    const [selectedTeam, setSelectedTeam] = useState(new Set([]));
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));

        const selectedRoomId = selectedRoom.size > 0 ? parseInt(Array.from(selectedRoom)[0]) : null;
        const selectedTeamId = selectedTeam.size > 0 ? parseInt(Array.from(selectedTeam)[0]) : null;
        const fullData = { ...formData, bTeamPointsEnabled, bRoomPointsEnabled, roomId: selectedRoomId, teamId: selectedTeamId };
        await confirmAction(fullData);
    };
    const handleClose = () => {
        setModalError(null);
        onClose();
    };
    useEffect(() => {
        setSelectedRoom(new Set([currentRoomId?.toString()]));
    }, [currentRoomId]);
    return (
        <Modal isOpen={isOpen} size="xl" onClose={handleClose}>
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={onSubmit} className="block" validationBehavior="native">
                        <Input isRequired errorMessage="Please enter a valid email" label="Email" name="sEmail" type="email" className="mb-4" size="sm" validate={(value) => regexEmail.test(value)} />
                        <div className="flex gap-4 mb-4">
                            <Input label="First Name" name="sFirstName" type="text" size="sm" />
                            <Input label="Last Name" name="sLastName" type="text" size="sm" />
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
                                <Button type="submit" color="primary">Add</Button>
                            </div>

                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}