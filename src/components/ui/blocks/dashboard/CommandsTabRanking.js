"use client";

// import nextui components
import { Card, CardBody, Button, CardHeader, Divider, Switch, Input } from "@nextui-org/react";

// import icons
import { InternetIcon, Tick02Icon } from "hugeicons-react";

// import store
import { useStatusStore } from "@/stores/status";
import { useRoomStore } from "@/stores/room";

// import action
import { setStatus } from "@/actions/status";

// import translations
import { AVAILABLE_COMMANDS } from "@/libs/socket";

export default function CommandsTabRanking({selectedTargets}) {
    const status = useStatusStore((state) => state.status);
    const currentRoomId = useRoomStore((state) => state.currentRoomId);

    const handlePressBtn = async (command) => {
        const data = {...status};
        if(selectedTargets.has("participant")) data.sActiveCommandParticipant = command;
        if(selectedTargets.has("screen")) data.sActiveCommandScreen = command;
        await setStatus(data, Array.from(selectedTargets), currentRoomId);
    };

    return (
        <div className="flex gap-4 h-full">
            <Card shadow="sm" className="flex-1">
                <CardHeader className="text-sm justify-center font-semibold text-primary">PARTIALS</CardHeader>
                <Divider />
                <CardBody className="p-4 flex flex-col gap-4 items-center">
                    <Button fullWidth color="primary" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.PARTIAL_RANKING_TEAMS)}>{AVAILABLE_COMMANDS.PARTIAL_RANKING_TEAMS}</Button>
                    <Button fullWidth color="default" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.PARTIAL_RANKING_ROOMS)}>{AVAILABLE_COMMANDS.PARTIAL_RANKING_ROOMS}</Button>
                </CardBody>
            </Card>
            <Card shadow="sm" className="flex-1">
                <CardHeader className="text-sm justify-center font-semibold text-primary">FINALS</CardHeader>
                <Divider />
                <CardBody className="p-4 flex flex-col gap-4 items-center">
                    <Button fullWidth color="primary" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.FINAL_RANKING_TEAMS)}>{AVAILABLE_COMMANDS.FINAL_RANKING_TEAMS}</Button>
                    <Button fullWidth color="default" onPress={() => handlePressBtn(AVAILABLE_COMMANDS.FINAL_RANKING_ROOMS)}>{AVAILABLE_COMMANDS.FINAL_RANKING_ROOMS}</Button>
                </CardBody>
            </Card>
            <div className="flex-1"></div>
        </div>
    );
}