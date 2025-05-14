"use client";
// import hooks
import { useState } from "react";

// import custom ui components
import CommandsSection from "@/components/ui/blocks/dashboard/CommandsSection";
import QuestionsSection from "@/components/ui/blocks/dashboard/QuestionsSection";

import { SOCKET_TARGETS} from "@/libs/socket";

export default function Dashboard() {
    const availableTargets = [SOCKET_TARGETS.PARTICIPANT, SOCKET_TARGETS.SCREEN];
    const [selectedTargets, setSelectedTargets] = useState(new Set(availableTargets));
    return (
        <>
            <CommandsSection availableTargets={availableTargets} selectedTargets={selectedTargets} setSelectedTargets={setSelectedTargets}  />
            <QuestionsSection selectedTargets={selectedTargets} />
        </>
    );
}