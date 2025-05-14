"use client";

// import nextui components
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Chip } from "@nextui-org/react";

// import custom icons
import { Edit02Icon, Delete01Icon } from "hugeicons-react";

// import utils
import { capitalizeFirstLetter } from "@/libs/utils";

import { useCallback, useEffect, useMemo, useState } from "react";

export default function ParticipantsTable({ participants, selectedParticipantsKeys, setSelectedParticipantsKeys, editAction, deleteAction, lastAction }) {
    const columns = [
        { label: "ID", key: "id", sortable: true },
        { label: "EMAIL", key: "sEmail", sortable: true },
        { label: "FIRSTNAME", key: "sFirstName", sortable: true },
        { label: "LASTNAME", key: "sLastName", sortable: true },
        { label: "STATUS", key: "status", sortable: false },
        { label: "TEAMS", key: "team", sortable: false },
        { label: "ROOMS", key: "room", sortable: false },
        { label: "ACTIONS", key: "actions", sortable: false }
    ];
    
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    const paginatedParticipants = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return participants.slice(start, end);
    }, [participants, page]);

    const tableFooter = useMemo(() => {
        return (
            <div className="flex justify-center">
                <Pagination
                    page={page}
                    color="primary"
                    total={Math.ceil(participants.length / rowsPerPage)}
                    showShadow
                    showControls
                    isCompact
                    onChange={setPage}
                />
            </div>
        )
    }, [participants.length, page, rowsPerPage]);

    const handleDeleteBtn = useCallback((participantId) => () => {
        setSelectedParticipantsKeys(new Set([participantId]));
        deleteAction();
    }, [setSelectedParticipantsKeys, deleteAction]);

    const handleEditBtn = useCallback((participantId) => () => {
        setSelectedParticipantsKeys(new Set([participantId]));
        editAction();
    }, [setSelectedParticipantsKeys, editAction]);

    const renderCell = useCallback((participant, key) => {
        const statusColorMap = {
            online: "success",
            logged: "warning",
            inactive: "danger"
        };
        switch (key) {
            case "status":
                const dtmLogin = participant.dtmLogin;
                const dtmLogout = participant.dtmLogout;
                const dtmConnected = participant.dtmConnected;
                const dtmDisconnected = participant.dtmDisconnected;
                let status = "inactive";
                if (dtmLogin !== null) {
                    status = "logged";
                }
                if (dtmConnected !== null && dtmDisconnected === null) {
                    status = "online";
                }
                return (
                    <Chip color={statusColorMap[status]} variant="flat">{capitalizeFirstLetter(status)}</Chip>
                )
            case "team":
            case "room":
                return participant[key]?.sName;
            case "actions":
                return (
                    <>
                        <Button isIconOnly aria-label="Edit" color="transparent" size="md" onPress={handleEditBtn(participant.id.toString())}>
                            <Edit02Icon className="size-5" />
                        </Button>
                        <Button isIconOnly aria-label="Delete" color="transparent" size="md" onPress={handleDeleteBtn(participant.id.toString())}>
                            <Delete01Icon className="text-danger size-5" />
                        </Button>
                    </>
                )
            default:
                return participant[key];
        }
    }, [handleDeleteBtn, handleEditBtn]);

    useEffect(() => {
        if(lastAction === "delete" && page > Math.ceil(participants.length / rowsPerPage)){
            const newPage = Math.max(1, Math.ceil(participants.length / rowsPerPage));
            setPage(newPage);
        }
    }, [participants, lastAction, page]);
    return (
        <>
            <Table
                aria-label="Participants Table"
                isHeaderSticky
                bottomContent={tableFooter}
                bottomContentPlacement="outside"
                selectionMode="multiple"
                selectedKeys={selectedParticipantsKeys}
                onSelectionChange={setSelectedParticipantsKeys}
            >
                <TableHeader>
                    {
                        columns.map((column) =>
                            <TableColumn
                                key={column.key}
                                align="center"
                            >
                                {column.label}
                            </TableColumn>
                        )
                    }
                </TableHeader>
                <TableBody emptyContent="No participants found">
                    {
                        paginatedParticipants.map((participant) =>
                            <TableRow key={participant.id}>
                                {columns.map((column) => (
                                    <TableCell key={`${participant.id}-${column.key}`}>
                                        {renderCell(participant, column.key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    )
}