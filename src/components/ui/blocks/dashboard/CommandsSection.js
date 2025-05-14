"use client";

// import nextui components
import { Card, CardHeader, CardBody, Divider, Select, SelectItem, Tabs, Tab} from "@nextui-org/react";

//import custom components
import CommandsTabGeneral from "./CommandsTabGeneral";
import CommandsTabRanking from "./CommandsTabRanking";
import CommandsTabReset from "./CommandsTabReset";

// import icons
import { Settings02Icon, ChartLineData01Icon, RankingIcon, ReloadIcon } from "hugeicons-react";

// import store
import { useStatusStore } from "@/stores/status";

import { SOCKET_TARGETS} from "@/libs/socket";
import { capitalizeFirstLetter } from "@/libs/utils";


export default function CommandsSection({availableTargets, selectedTargets, setSelectedTargets}) {

    const commandTabs = [
        { key: "general", title: "General", icon: <Settings02Icon className="size-5 stroke-2" />, component: <CommandsTabGeneral selectedTargets={selectedTargets} /> },
        { key: "ranking", title: "Ranking", icon: <RankingIcon className="size-5 stroke-2" />, component: <CommandsTabRanking selectedTargets={selectedTargets} /> },
        { key: "compare", title: "Comparison", icon: <ChartLineData01Icon className="size-5 stroke-2" /> },
        { key: "reset", title: "Reset", icon: <ReloadIcon className="size-5 stroke-2" />, component: <CommandsTabReset /> }
    ];

    const status = useStatusStore((state) => state.status);
    
    return (
        <div className="flex gap-8 h-full mb-10">
            <div className="flex w-[30%] flex-col gap-3">
                <Select 
                    selectedKeys={selectedTargets} 
                    onSelectionChange={setSelectedTargets} 
                    selectionMode="multiple" 
                    label="Selected Targets" 
                    size="sm" 
                    className="select-white" 
                    radius="lg"
                >
                    {
                        availableTargets.map((target) => (
                            <SelectItem key={target}>{capitalizeFirstLetter(target)}</SelectItem>
                        ))
                    }
                </Select>
                <div className="flex gap-4 flex-1">
                    <Card className={`flex-1 bg-primary text-white ${!selectedTargets.has(SOCKET_TARGETS.PARTICIPANT)&&"opacity-30"}`} shadow="sm">
                        <CardHeader className="text-sm justify-center font-semibold">
                            {SOCKET_TARGETS.PARTICIPANT.toUpperCase()}
                        </CardHeader>
                        <Divider />
                        <CardBody className="text-center justify-center text-2xl font-semibold py-4 min-h-[130px]">
                            {status && status.sActiveCommandParticipant}
                        </CardBody>
                    </Card>
                    <Card className={`flex-1 bg-warning text-white ${!selectedTargets.has(SOCKET_TARGETS.SCREEN)&&"opacity-30"}`} shadow="sm">
                        <CardHeader className="text-sm justify-center font-semibold">
                            {SOCKET_TARGETS.SCREEN.toUpperCase()}
                        </CardHeader>
                        <Divider />
                        <CardBody className="text-center justify-center text-2xl font-semibold py-4 min-h-[130px]">
                            {status && status.sActiveCommandScreen}
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <Tabs aria-label="Commands"  className="commandsTabsPanel" size="lg" color="primary">
                    {
                        commandTabs.map((tab) =>
                            <Tab key={tab.key} title={<div className="flex items-center gap-2">{tab.icon}{tab.title}</div>}>
                                {tab.component}
                            </Tab>
                        )
                    }
                </Tabs>
            </div>
        </div>
    )
}