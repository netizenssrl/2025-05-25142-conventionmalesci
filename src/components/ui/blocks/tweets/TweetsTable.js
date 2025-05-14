"use client";

// import nextui components
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Chip } from "@nextui-org/react";

// import custom icons
import { Edit02Icon, Delete01Icon } from "hugeicons-react";

// import utils
import { capitalizeFirstLetter } from "@/libs/utils";

import { useCallback, useEffect, useMemo, useState } from "react";

export default function TweetsTable({tweets, selectedTweetsKeys, setSelectedTweetsKeys, editAction, deleteAction, lastAction }){
    const columns = [
        { label: "ID", key: "id", sortable: true },
        { label: "TEXT", key: "sTextOriginal", sortable: false },
        { label: "EMAIL", key: "sEmail", sortable: true },
        { label: "STATUS", key: "status", sortable: false },
        { label: "CREATED AT", key: "dtmCreated", sortable: true },
        { label: "APPROVED AT", key: "dtmApproved", sortable: true },
        { label: "ROOMS", key: "room", sortable: false },
        { label: "ACTIONS", key: "actions", sortable: false }
    ];
    

    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    const paginatedTweets = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return tweets.slice(start, end);
    }, [tweets, page]);

    const tableFooter = useMemo(() => {
        return (
            <div className="flex justify-center">
                <Pagination
                    page={page}
                    color="primary"
                    total={Math.ceil(tweets.length / rowsPerPage)}
                    showShadow
                    showControls
                    isCompact
                    onChange={setPage}
                />
            </div>
        )
    }, [tweets.length, page, rowsPerPage]);

    const handleDeleteBtn = useCallback((tweetId) => () => {
        setSelectedTweetsKeys(new Set([tweetId]));
        deleteAction();
    }, [deleteAction, setSelectedTweetsKeys]);

    const handleEditBtn = useCallback((tweetId) => () => {
        setSelectedTweetsKeys(new Set([tweetId]));
        editAction();
    }, [setSelectedTweetsKeys, editAction]);

    const renderCell = useCallback((tweet, key) => {
        const statusColorMap = {
            created: "default",
            approved: "success",
            archived: "warning",
            onscreen: "secondary"
        };
        switch (key) {
            case "status":
                const bApproved = tweet.bApproved;
                const bArchived = tweet.bArchived;
                const bOnScreen = tweet.bOnScreen;
                let status = "";
                if(bApproved){
                    status = "approved";
                }
                if(bArchived){
                    status = "archived";
                }
                if(bOnScreen){
                    status = "onscreen";
                }

                if(status !== ""){
                    return <Chip color={statusColorMap[status]} variant="flat">{capitalizeFirstLetter(status)}</Chip>;
                    
                }
                else{
                    return <></>;
                }
            case "sEmail":
                return tweet.participant?.sEmail;
            case "sTextOriginal":
                return tweet.sTextOriginal.length > 40 ? `${tweet.sTextOriginal.substring(0, 40)} [...]` : tweet.sTextOriginal;
            case "dtmCreated":
            case "dtmApproved":
                if(tweet[key]){
                    const date = new Date(tweet[key]);
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
                }
                else{
                    return <></>;
                }
            case "room":
                return tweet.participant?.room?.sName;
            case "actions":
                return (
                    <>
                        <Button isIconOnly aria-label="Edit" color="transparent" size="md" onPress={handleEditBtn(tweet.id.toString())}>
                            <Edit02Icon className="size-5" />
                        </Button>
                        <Button isIconOnly aria-label="Delete" color="transparent" size="md" onPress={handleDeleteBtn(tweet.id.toString())}>
                            <Delete01Icon className="text-danger size-5" />
                        </Button>
                    </>
                )
            default:
                return tweet[key];
        }
    }, [handleDeleteBtn, handleEditBtn]);
    useEffect(() => {
        if(lastAction === "delete" && page > Math.ceil(tweets.length / rowsPerPage)){
            const newPage = Math.max(1, Math.ceil(tweets.length / rowsPerPage));
            setPage(newPage);
        }
    }, [tweets, lastAction, page]);

    return (
        <>
            <Table
                aria-label="Tweets Table"
                isHeaderSticky
                bottomContent={tableFooter}
                bottomContentPlacement="outside"
                selectionMode="multiple"
                selectedKeys={selectedTweetsKeys}
                onSelectionChange={setSelectedTweetsKeys}
            >
                <TableHeader>
                    {
                        columns.map((column) =>
                            <TableColumn
                                key={column.key}
                                align={column.key !== "sTextOriginal" ? "center" : "left"}
                            >
                                {column.label}
                            </TableColumn>
                        )
                    }
                </TableHeader>
                <TableBody emptyContent="No tweets found">
                    {
                        paginatedTweets.map((tweet) =>
                            <TableRow key={tweet.id}>
                                {columns.map((column) => (
                                    <TableCell key={`${tweet.id}-${column.key}`}>
                                        {renderCell(tweet, column.key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    );
}