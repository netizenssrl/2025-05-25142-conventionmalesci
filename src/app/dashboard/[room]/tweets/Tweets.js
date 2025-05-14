"use client";
// import hooks
import { useState, useEffect } from "react";

// import nextui components
import { Card, CardBody, useDisclosure, Input, Button, Select, SelectItem } from "@nextui-org/react";

// import custom ui components
import TweetsCounters from "@/components/ui/blocks/tweets/TweetsCounters";
import TweetsTable from "@/components/ui/blocks/tweets/TweetsTable";
import AddTweetModal from "@/components/ui/modals/tweets/AddTweetModal";
import EditTweetModal from "@/components/ui/modals/tweets/EditTweetModal";
import ConfirmationModal from "@/components/ui/modals/common/ConfirmationModal";

// import icons
import { PlusSignIcon, Delete01Icon} from "hugeicons-react";

// import stores
import { useTweetStore } from "@/stores/tweet";

// import actions
import { createTweet, updateTweet, deleteTweet } from "@/actions/tweet";

export default function Tweets(){

    const tweets = useTweetStore((state) => state.tweets);

    const [filteredTweets, setFilteredTweets] = useState(tweets);
    const [selectedTweetsKeys, setSelectedTweetsKeys] = useState(new Set([]));
    const [selectedStatusKeys, setSelectedStatusKeys] = useState(new Set([]));
    const availableStatuses = [
        {key: "bApproved", label: "Approved", color: "success"},
        {key: "bOnScreen", label: "On Screen", color: "secondary"},
        {key: "bArchived", label: "Archived", color: "warning"},
    ];
    const [modalError, setModalError] = useState(null);
    const [lastAction, setLastAction] = useState("");

    // modals disclosure
    const useAddTweetModalDisclosure = useDisclosure();
    const useEditTweetModalDisclosure = useDisclosure();
    const useConfirmDisclosure = useDisclosure();
    
    const handleAddTweetBtn = () => useAddTweetModalDisclosure.onOpen();
    const confirmAddTweet = async (data) => {
        try{
            await createTweet(data);
            useAddTweetModalDisclosure.onClose();
            setModalError(null);
            setLastAction("create");
        }
        catch (error) {
            setModalError(error.message);
        }
    };
    const handleEditBtn = () => {
        useEditTweetModalDisclosure.onOpen();
    };
    const confirmEditTweet = async (data) => {
        try {
            await updateTweet(data);
            useEditTweetModalDisclosure.onClose();
            setSelectedTweetsKeys(new Set([]));
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
            let selectedTweetsKeysArrayInt = [];
            if(selectedTweetsKeys === "all"){
                selectedTweetsKeysArrayInt = filteredTweets.map((tweet) => tweet.id);
            }
            else{
                selectedTweetsKeysArrayInt = Array.from(selectedTweetsKeys).map((key) => parseInt(key));
            }
            await deleteTweet(selectedTweetsKeysArrayInt);
            useConfirmDisclosure.onClose();
            setSelectedTweetsKeys(new Set([]));
            setModalError(null);
            setLastAction("delete");
        }
        catch (error) {
            setModalError(error.message);
        }
    };

    useEffect(() => {
        if(selectedStatusKeys.size === 0){
            setFilteredTweets(tweets);
        }
        else{
            const selectedStatusKey = Array.from(selectedStatusKeys)[0];
            const filteredTweets = tweets.filter((tweet) => tweet[selectedStatusKey]);
            setFilteredTweets(filteredTweets);
        }
    }, [tweets, selectedStatusKeys]);

    return(
        <>
            <TweetsCounters
                tweets={tweets}
                className="mb-4"
            />
            <Card shadow="sm">
                <CardBody className="p-8">
                    <div className="flex justify-between gap-8 mb-4">
                        <div className="flex gap-4 lg:w-1/4 2xl:w-1/6">
                            <Select
                                aria-label="Filter by status"
                                placeholder="Filter by status"
                                selectedKeys={selectedStatusKeys}
                                onSelectionChange={setSelectedStatusKeys}
                                size="md"
                            >
                                {
                                    availableStatuses.map((status) => (
                                        <SelectItem key={status.key} value={status.key} color={status.color} variant="flat">{status.label}</SelectItem>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="flex gap-4">
                            <Button color="primary" endContent={<PlusSignIcon className="size-5" />} onPress={handleAddTweetBtn}>Add New</Button>
                            <Button color="danger" endContent={<Delete01Icon className="size-5" />} onPress={handleDeleteBtn} isDisabled={selectedTweetsKeys.size === 0}>Delete</Button>
                        </div>
                    </div>
                    <TweetsTable 
                        tweets={filteredTweets}
                        selectedTweetsKeys={selectedTweetsKeys}
                        setSelectedTweetsKeys={setSelectedTweetsKeys}
                        editAction={handleEditBtn}
                        deleteAction={handleDeleteBtn}
                        lastAction={lastAction}
                    />
                </CardBody>
            </Card>
            <AddTweetModal
                isOpen={useAddTweetModalDisclosure.isOpen}
                onClose={useAddTweetModalDisclosure.onClose}
                confirmAction={confirmAddTweet}
                modalError={modalError}
                setModalError={setModalError}
                title="Add Tweet"
            />
            <EditTweetModal
                isOpen={useEditTweetModalDisclosure.isOpen}
                onClose={useEditTweetModalDisclosure.onClose}
                confirmAction={confirmEditTweet}
                modalError={modalError}
                setModalError={setModalError}
                title="Edit Tweet"
                selectedTweetsKeys={selectedTweetsKeys}
            />
            <ConfirmationModal
                isOpen={useConfirmDisclosure.isOpen}
                onClose={useConfirmDisclosure.onClose}
                confirmAction={confirmDelete}
                modalError={modalError}
                setModalError={setModalError}
                title="Confirm deletion"
                body="Are you sure you want to delete the selected Tweets?"
            />
        </>
    );
}