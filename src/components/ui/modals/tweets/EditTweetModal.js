"use client";

// import hooks
import { useState, useEffect } from "react";

// import nextui components
import { Alert, Modal, ModalContent, ModalHeader, ModalBody, Button, Select, SelectItem, Form, Switch, Textarea } from "@nextui-org/react";

// import stores
import { useParticipantStore } from "@/stores/participant";

import { useTweetStore } from "@/stores/tweet";

export default function EditTweetModal({ isOpen, onClose, confirmAction, title, modalError, setModalError, selectedTweetsKeys }) {
    const participants = useParticipantStore((state) => state.participants);

    const tweets = useTweetStore((state) => state.tweets);

    const [selectedTweet, setSelectedTweet] = useState(null);
    const [selectedParticipantKeys, setSelectedParticipantKeys] = useState(new Set([]));

    const [bApproved, setApproved] = useState(true);
    const [bArchived, setArchived] = useState(false);
    const [bOnScreen, setOnScreen] = useState(false);

    useEffect(() => {
        if (selectedTweetsKeys.size === 1 && isOpen) {
            const selectedTweetId = parseInt(Array.from(selectedTweetsKeys)[0]);
            const tweet = tweets.find((tweet) => tweet.id === selectedTweetId);
            setSelectedTweet(tweet);
            setSelectedParticipantKeys(new Set([tweet.participantId?.toString()]));
            setApproved(tweet.bApproved);
            setArchived(tweet.bArchived);
            setOnScreen(tweet.bOnScreen);
        }
        else {
            setSelectedTweet(null);
            setSelectedParticipantKeys(new Set([]));
        }
    }, [selectedTweetsKeys, isOpen, tweets]);

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

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        
        // cast the participantId to integer and booleans
        formData.id = selectedTweet.id;
        formData.bApprovedEdited = bApproved !== selectedTweet.bApproved;
        formData.bArchivedEdited = bArchived !== selectedTweet.bArchived;
        formData.bOnScreenEdited = bOnScreen !== selectedTweet.bOnScreen;

        const selectedParticipantId = parseInt(Array.from(selectedParticipantKeys)[0]);
        const fullData = { ...formData, bApproved, bArchived, bOnScreen, participantId: selectedParticipantId };
        await confirmAction(fullData);
    };
    return (
        <Modal isOpen={isOpen} size="4xl" onClose={handleClose}>
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    {
                        selectedTweet && (
                            <Form onSubmit={onSubmit} className="block" validationBehavior="native">
                                <Textarea readOnly label="Original text" name="sTextOriginal" className="mb-4" size="sm" minRows={4} defaultValue={selectedTweet.sTextOriginal} />
                                <Textarea label="Edited text" name="sTextEdited" className="mb-4" size="sm" placeholder="Enter edited text" minRows={4} defaultValue={selectedTweet.sTextEdited} />
                                <div className="flex gap-4 mb-4">
                                    <Select 
                                        label="Participant" 
                                        className="w-full mb-4 flex-1" 
                                        size="sm" 
                                        selectedKeys={selectedParticipantKeys} 
                                        onSelectionChange={setSelectedParticipantKeys} 
                                        isRequired
                                        errorMessage="Please select a participant"
                                        isDisabled
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
                                <div className="flex gap-4 justify-end">
                                    <Button onPress={onClose} color="default" variant="flat">Cancel</Button>
                                    <Button type="submit" color="primary">Edit</Button>
                                </div>
                            </Form>
                        )
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}