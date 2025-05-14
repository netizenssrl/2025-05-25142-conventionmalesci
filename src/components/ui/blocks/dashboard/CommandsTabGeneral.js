"use client";

// import hooks
import { useEffect, useState } from "react";

// import nextui components
import { Card, CardBody, Button, CardHeader, Divider, Switch, Input } from "@nextui-org/react";

// import icons
import { InternetIcon, Tick02Icon } from "hugeicons-react";

// import store
import { useStatusStore } from "@/stores/status";
import { useRoomStore } from "@/stores/room";

// import action
import { setStatus } from "@/actions/status";

import { AVAILABLE_COMMANDS } from "@/libs/socket";

export default function CommandsTabGeneral({selectedTargets}) {
    const status = useStatusStore((state) => state.status);
    const currentRoomId = useRoomStore((state) => state.currentRoomId);
    
    const [bQRCodeEnabled, setQRCodeEnabled] = useState(status.bQRCodeEnabled);
    const [bTweetEnabled, setTweetEnabled] = useState(status.bTweetEnabled);
    const [bLoginEnabled, setLoginEnabled] = useState(status.bLoginEnabled);
    const [surveyURL, setSurveyURL] = useState(status.sSurveyLink);

    useEffect(() => {
        if(status) {
            if(status.bQRCodeEnabled !== bQRCodeEnabled) setQRCodeEnabled(status.bQRCodeEnabled);
            if(status.bTweetEnabled !== bTweetEnabled) setTweetEnabled(status.bTweetEnabled);
            setSurveyURL(status.sSurveyLink);
        }
    }, [status, bQRCodeEnabled, bTweetEnabled]);

    const handlePressBtn = async (command) => {
        const data = {...status};
        if(selectedTargets.has("participant")) data.sActiveCommandParticipant = command;
        if(selectedTargets.has("screen")) data.sActiveCommandScreen = command;
        await setStatus(data, Array.from(selectedTargets), currentRoomId);
    };
    const handleQRCodeChange = async () => {
        const data = {...status, bQRCodeEnabled: !status.bQRCodeEnabled};
        setQRCodeEnabled(!status.bQRCodeEnabled);
        await setStatus(data, Array.from(selectedTargets), currentRoomId);
    };
    const handleTweetChange = async () => {
        const data = {...status, bTweetEnabled: !status.bTweetEnabled};
        setTweetEnabled(!status.bTweetEnabled);
        await setStatus(data, Array.from(selectedTargets), currentRoomId);
    };
    const handleSetSurveyURL = async () => {
        const data = {...status, sSurveyLink: surveyURL};
        await setStatus(data, Array.from(selectedTargets), currentRoomId);
    };
        


    return (
        <div className="flex gap-4 h-full">
            <Card shadow="sm" className="flex-1">
                <CardHeader className="text-sm justify-center font-semibold text-primary">SET VIEW</CardHeader>
                <Divider />
                <CardBody className="p-4 flex gap-4">
                    <div className="flex flex-row gap-4">
                        <Button fullWidth color="primary" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.LOGIN)}>{AVAILABLE_COMMANDS.LOGIN}</Button>
                        <Button fullWidth color="primary" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.COVER)}>{AVAILABLE_COMMANDS.COVER}</Button>
                    </div>
                    <Button fullWidth color="primary" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.QRCODE)}>{AVAILABLE_COMMANDS.QRCODE}</Button>
                </CardBody>
            </Card>
            <Card shadow="sm" className="flex-1">
                <CardHeader className="text-sm justify-center font-semibold text-primary">SETTINGS</CardHeader>
                <Divider />
                <CardBody className="p-4 flex flex-row gap-4 items-center justify-center">
                    <Switch isSelected={bQRCodeEnabled} onValueChange={handleQRCodeChange} size="sm">
                        QR Code
                    </Switch>
                    <Switch isSelected={bTweetEnabled} onValueChange={handleTweetChange} size="sm">
                        Tweets
                    </Switch>
                    <Switch isSelected={bLoginEnabled} onValueChange={setLoginEnabled} size="sm">
                        Login
                    </Switch>
                </CardBody>
            </Card>
            <Card shadow="sm" className="flex-1">
                <CardHeader className="text-sm justify-center font-semibold text-primary">SURVEY</CardHeader>
                <Divider />
                <CardBody className="p-4 flex flex-col gap-4 justify-center">
                    <div className="flex flex-row gap-2 items-end">
                        <Input 
                            type="url"  
                            size="md" 
                            startContent={<InternetIcon />} 
                            placeholder="https://"
                            value={surveyURL}
                            onValueChange={setSurveyURL}
                            className="flex-1"
                            variant="bordered"
                            color="primary"
                        />
                        <Button color={(surveyURL !== status.sSurveyLink) ? "success" : "default"} isIconOnly isDisabled={surveyURL === status.sSurveyLink} onPress={()=>handleSetSurveyURL()}>
                            <Tick02Icon className="size-5 text-white" />
                        </Button>
                    </div>
                    <Button color="primary" isDisabled={surveyURL === ""} onPress={()=>handlePressBtn(AVAILABLE_COMMANDS.SURVEY)}>Open</Button>
                </CardBody>
            </Card>
        </div>
        
    );
}