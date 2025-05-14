
import React from 'react';
import { Alert, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function ConfirmationModal({ isOpen, onClose, confirmAction, title, body, modalError, setModalError}) {
    const handleClose = () => {
        setModalError(null);
        onClose();
    };
    return (
        <Modal isOpen={isOpen} size="lg" onClose={handleClose}>
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    {body}
                    {modalError && <Alert color="danger" title={modalError} />}
                </ModalBody>
                <ModalFooter>
                    <Button onPress={onClose} color="default" variant="flat">Cancel</Button>
                    <Button onPress={confirmAction} color="danger">Delete</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

}