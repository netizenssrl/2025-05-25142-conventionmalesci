"use client";

// import hooks
import { useEffect } from "react";

// import socket constants
import { SOCKET_EVENTS, SOCKET_TARGETS } from "@/libs/socket";

// import stores
import { useSocketStore } from "@/stores/socket";
import { useTweetStore } from "@/stores/tweet";

export default function TweetsSocketProvider({ children, initialTweets }) {
    const setTweets = useTweetStore((state) => state.setTweets);
    const createTweet = useTweetStore((state) => state.createTweet);
    const updateTweet = useTweetStore((state) => state.updateTweet);
    const deleteTweet = useTweetStore((state) => state.deleteTweet);
    const socketStore = useSocketStore();
    
    useEffect(() => {
        setTweets(initialTweets);
    }, [initialTweets, setTweets]);

    useEffect(() => {
        const socket = socketStore.getSocket();
        if(!socketStore.socket.bConnected || !socket) return;

        socket.on(SOCKET_EVENTS.TWEET.CREATED, (tweet) => {
            createTweet(tweet);
        });
        socket.on(SOCKET_EVENTS.TWEET.UPDATED, (tweet) => {
            updateTweet(tweet);
        });
        socket.on(SOCKET_EVENTS.TWEET.DELETED, (tweetIds) => {
            deleteTweet(tweetIds);
        });
        return () => {
            socket.off(SOCKET_EVENTS.TWEET.CREATED);
            socket.off(SOCKET_EVENTS.TWEET.UPDATED);
            socket.off(SOCKET_EVENTS.TWEET.DELETED);
        }

    }, [socketStore.socket.bConnected, createTweet, updateTweet, deleteTweet, socketStore]);

    return <>{children}</>;
}
