"use client";

// import nextui components
import { Card, CardBody } from "@nextui-org/react";

// import custom ui components
import CardCounter from "@/components/ui/blocks/common/CardCounter";

export default function ParticipantsCounters({ participants, className}) {

    const onlineParticipants = participants.filter((participant) => {
        return (participant.dtmConnected !== null && participant.dtmDisconnected === null);
    });
    const loggedParticipants = participants.filter((participant) => {
        return participant.dtmLogin !== null;
    });
    const inactiveParticipants = participants.filter((participant) => {
        return participant.dtmLogin === null && participant.dtmLogout === null;
    });

    return (
        <div className={className}>
            <Card shadow="sm">
                <CardBody>
                    <div className="flex gap-8 p-4">
                        <CardCounter label="TOTAL" count={participants.length} color="primary" />
                        <CardCounter label="ONLINE" count={onlineParticipants.length} color="success" />
                        <CardCounter label="LOGGED" count={loggedParticipants.length} color="warning" />
                        <CardCounter label="INACTIVE" count={inactiveParticipants.length} color="danger"  />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}