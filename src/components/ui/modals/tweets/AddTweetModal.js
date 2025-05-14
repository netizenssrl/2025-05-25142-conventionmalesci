"use client";

// import hooks
import { useEffect, useState } from "react";

// import nextui components
import { Alert, Modal, ModalContent, ModalHeader, ModalBody, Button, Select, SelectItem, Form, Switch, Textarea } from "@nextui-org/react";

// import stores
import { useParticipantStore } from "@/stores/participant";

export default function AddTweetModal({ isOpen, onClose, confirmAction, title, modalError, setModalError }) {
    const participants = useParticipantStore((state) => state.participants);
    const [selectedParticipantKeys, setSelectedParticipantKeys] = useState(new Set([]));
    const [bApproved, setApproved] = useState(true);
    const [bArchived, setArchived] = useState(false);
    const [bOnScreen, setOnScreen] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));

        const selectedParticipantId = parseInt(Array.from(selectedParticipantKeys)[0]);
        const fullData = { ...formData, bApproved, bArchived, bOnScreen, participantId: selectedParticipantId };
        
        await confirmAction(fullData);
    };
    const handleClose = () => {
        setModalError(null);
        onClose();
    };
    useEffect(() => {
        if(bApproved){
            setArchived(false);
        }
        else{
            setOnScreen(false);
        }
    }, [bApproved]);
    useEffect(() => {
        if(bArchived){
            setApproved(false);
            setOnScreen(false);
        }
    }, [bArchived]);
    useEffect(() => {
        if(bOnScreen){
            setArchived(false);
            setApproved(true);
        }
    }, [bOnScreen]);
    return (
        <Modal isOpen={isOpen} size="4xl" onClose={handleClose}>
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={onSubmit} className="block" validationBehavior="native">
                        <Textarea isRequired errorMessage="Please enter a valid text" label="Text" name="sTextOriginal" className="mb-4" size="sm" placeholder="Enter your tweet" minRows={4} />
                        <div className="flex gap-4 mb-4">
                            <Select 
                                label="Participant" 
                                name="participantId" 
                                className="w-full mb-4 flex-1" 
                                size="sm" 
                                selectedKeys={selectedParticipantKeys} 
                                onSelectionChange={setSelectedParticipantKeys} 
                                isRequired
                                errorMessage="Please select a participant"
                            >
                                {participants.map((participant) => (
                                    <SelectItem key={participant.id}>{`${participant.sFirstName} ${participant.sLastName}`}</SelectItem>
                                ))}
                            </Select>
                            <div className="flex gap-4 mb-4">
                                <Switch isSelected={bApproved} name="bApproved" size="sm" onValueChange={setApproved}>Approved</Switch>
                                <Switch isSelected={bArchived} name="bArchived" size="sm" onValueChange={setArchived}>Archived</Switch>
                                <Switch isSelected={bOnScreen} name="bOnScreen" size="sm" onValueChange={setOnScreen}>On Screen</Switch>
                            </div>
                        </div>
                        {modalError && <div className="mb-8"><Alert color="danger" title={modalError} /></div>}
                        <div className="flex gap-4 mb-4 justify-end">
                            <Button onPress={onClose} color="default" variant="flat">Cancel</Button>
                            <Button type="submit" color="primary">Add</Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}