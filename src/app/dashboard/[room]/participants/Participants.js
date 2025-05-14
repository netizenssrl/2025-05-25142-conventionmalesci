"use client";
// import hooks
import { useEffect, useState } from "react";

// import nextui components
import { Card, CardBody, useDisclosure, Input, Button, Select, SelectItem } from "@nextui-org/react";

// import custom ui components
import ParticipantsCounters from "@/components/ui/blocks/participants/ParticipantsCounters";
import ParticipantsTable from "@/components/ui/blocks/participants/ParticipantsTable";
import AddParticipantModal from "@/components/ui/modals/participants/AddParticipantModal";
import EditParticipantModal from "@/components/ui/modals/participants/EditParticipantModal";
import ConfirmationModal from "@/components/ui/modals/common/ConfirmationModal";

// import icons
import { PlusSignIcon, Delete01Icon, Search01Icon } from "hugeicons-react";

// import stores
import { useTeamStore } from "@/stores/team";
import { useParticipantStore } from "@/stores/participant";

// import actions
import { createParticipant, updateParticipant, deleteParticipant } from "@/actions/participant";


const filterParticipants = (participants, searchEmailValue, selectedTeamId) => {
    const lowerSearchEmailValue = searchEmailValue.toLowerCase();
    return participants.filter((participant) => {
        return (
            (participant.sEmail.toLowerCase().includes(lowerSearchEmailValue)) &&
            (!selectedTeamId || participant.teamId === selectedTeamId)
        );
    });
};

export default function Participants() {

    const participants = useParticipantStore((state) => state.participants);
    const teams = useTeamStore((state) => state.teams);
    const [filteredParticipants, setFilteredParticipants] = useState(participants);

    const [selectedParticipantsKeys, setSelectedParticipantsKeys] = useState(new Set([]));
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    const [lastAction, setLastAction] = useState("");

    const [searchEmailValue, setSearchEmailValue] = useState("");

    // modals disclosure
    const useAddParticipantModalDisclosure = useDisclosure();
    const useEditParticipantModalDisclosure = useDisclosure();
    const useConfirmDisclosure = useDisclosure();

    useEffect(() => {
        const filteredParticipants = filterParticipants(participants, searchEmailValue, selectedTeamId);
        setFilteredParticipants(filteredParticipants);
    }, [participants, searchEmailValue, selectedTeamId]);

    const [modalError, setModalError] = useState(null);
    const handleAddParticipantBtn = () => useAddParticipantModalDisclosure.onOpen();
    const confirmAddParticipant = async (data) => {
        try {
            await createParticipant(data);
            useAddParticipantModalDisclosure.onClose();
            setModalError(null);
            setLastAction("create");
        }
        catch (error) {
            console.log(error);
            setModalError(error.message);
        }
    };

    const handleEditBtn = () => {
        useEditParticipantModalDisclosure.onOpen();
    };
    const confirmEditParticipant = async (data) => {
        try {
            await updateParticipant(data);
            useEditParticipantModalDisclosure.onClose();
            setModalError(null);
            setLastAction("edit");
        }
        catch (error) {
            setModalError(error.message);
        }
    };

    const handleDeleteBtn = () => {
        useConfirmDisclosure.onOpen();
    };
    const confirmDelete = async () => {
        try {
            let selectedParticipantsKeysArrayInt = [];
            if(selectedParticipantsKeys === "all"){
                selectedParticipantsKeysArrayInt = filterParticipants.map((participant) => participant.id);
            }
            else{
                selectedParticipantsKeysArrayInt = Array.from(selectedParticipantsKeys).map((key) => parseInt(key));
            }
            await deleteParticipant(selectedParticipantsKeysArrayInt);
            useConfirmDisclosure.onClose();
            setSelectedParticipantsKeys(new Set([]));
            setModalError(null);
            setLastAction("delete");
        }
        catch (error) {
            setModalError(error.message);
        }
        
    };
    return (
        <>
            <ParticipantsCounters
                participants={filteredParticipants}
                className="mb-4"
            />
            <Card shadow="sm">
                <CardBody className="p-8">
                    <div className="flex justify-between gap-8 mb-4">
                        <div className="flex gap-4 lg:w-1/2 2xl:w-1/3">
                            <Input
                                aria-label="Search by email"
                                placeholder="Search by email..."
                                value={searchEmailValue}
                                size="md"
                                onChange={(e) => setSearchEmailValue(e.target.value)}
                                startContent={<Search01Icon className="size-5" />}
                            />
                            <Select
                                aria-label="Filter by team"
                                placeholder="Filter by team"
                                onChange={(e) => { setSelectedTeamId(parseInt(e.target.value)) }}
                                size="md"
                            >
                                {
                                    teams.map((team) => {
                                        return <SelectItem key={team.id} value={team.id}>{team.sName}</SelectItem>;
                                    })
                                }
                            </Select>
                        </div>

                        <div className="flex gap-4">
                            <Button color="primary" endContent={<PlusSignIcon className="size-5" />} onPress={handleAddParticipantBtn}>Add New</Button>
                            <Button color="danger" endContent={<Delete01Icon className="size-5" />} onPress={handleDeleteBtn} isDisabled={selectedParticipantsKeys.size === 0}>Delete</Button>
                        </div>
                    </div>
                    <ParticipantsTable
                        participants={filteredParticipants}
                        selectedParticipantsKeys={selectedParticipantsKeys}
                        setSelectedParticipantsKeys={setSelectedParticipantsKeys}
                        editAction={handleEditBtn}
                        deleteAction={handleDeleteBtn}
                        lastAction={lastAction}
                    />
                </CardBody>
            </Card>
            <AddParticipantModal
                isOpen={useAddParticipantModalDisclosure.isOpen}
                onClose={useAddParticipantModalDisclosure.onClose}
                confirmAction={confirmAddParticipant}
                modalError={modalError}
                setModalError={setModalError}
                title="Add Participant"
            />
            <EditParticipantModal
                isOpen={useEditParticipantModalDisclosure.isOpen}
                onClose={useEditParticipantModalDisclosure.onClose}
                confirmAction={confirmEditParticipant}
                modalError={modalError}
                setModalError={setModalError}
                title="Edit Participant"
                selectedParticipantsKeys={selectedParticipantsKeys}
            />
            <ConfirmationModal
                isOpen={useConfirmDisclosure.isOpen}
                onClose={useConfirmDisclosure.onClose}
                confirmAction={confirmDelete}
                modalError={modalError}
                setModalError={setModalError}
                title="Confirm deletion"
                body="Are you sure you want to delete the selected participants?"
            />
        </>
    )
}