"use client";

// import hooks
import {useEffect, useState, useMemo, useCallback} from "react";

// import nextui components
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Chip } from "@nextui-org/react";

// import utils
import { capitalizeFirstLetter } from "@/libs/utils";

export default function VotingSessionsTable({votingSessions, selectedVotingSessionKeys, setSelectedVotingSessionKeys}) { 
    const columns = [
        { label: "ID", key: "id"},
        { label: "dtmStarted", key: "dtmStarted"},
        { label: "Status", key: "status"},
    ];
    const [page, setPage] = useState(1);
    const rowsPerPage = 3;

    const paginatedVotingSessions = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return votingSessions.slice(start, end);
    }, [votingSessions, page]);

    const tableFooter = useMemo(() => {
        if(votingSessions.length === 0){
            return null;
        }
        return (
            <div className="flex justify-center">
                <Pagination
                    page={page}
                    color="primary"
                    total={Math.ceil(votingSessions.length / rowsPerPage)}
                    showShadow
                    showControls
                    isCompact
                    size="sm"
                    onChange={setPage}
                />
            </div>
        )
    }, [votingSessions.length, page, rowsPerPage]);


    const renderCell = useCallback((votingSession, key) => {
        const statusColorMap = {
            started: "success",
            stopped: "danger"
        };
        switch (key) {
            case "status":
                let status = "";
                if(votingSession["dtmStopped"]){
                    status = "stopped";
                }
                else{
                    status = "started";
                }
                return (
                    <Chip color={statusColorMap[status]} variant="flat">{capitalizeFirstLetter(status)}</Chip>
                );
            case "dtmStarted":
                const date = new Date(votingSession[key]);
                const dateOption = { 
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };
                const formattedDate = date.toLocaleString('en-US', dateOption);
                return formattedDate;
            default:
                return votingSession[key];
        }
    }, []);
    
    return (
        <Table
            aria-label="Voting Sessions Table"
            bottomContent={tableFooter}
            bottomContentPlacement="outside"
            selectionMode="single"
            className="votingSessionsTable"
            selectedKeys={selectedVotingSessionKeys}
            onSelectionChange={setSelectedVotingSessionKeys}
        >
            <TableHeader >
                {
                    columns.map(column => (
                        <TableColumn key={column.key} align={column.key === "status" ? "center" : "left"}>{column.label}</TableColumn>
                    ))
                }
            </TableHeader>
            <TableBody emptyContent="No voting sessions found">
                {
                    paginatedVotingSessions.map(votingSession => (
                        <TableRow key={votingSession.id}>
                            {
                                columns.map(column => (
                                    <TableCell key={column.key}>
                                        {renderCell(votingSession, column.key)}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}