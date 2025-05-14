"use client";

// import nextui components
import { Card, CardBody } from "@nextui-org/react";

// import custom ui components
import CardCounter from "@/components/ui/blocks/common/CardCounter";

export default function TweetsCounters({ tweets, className}) {

    const approvedTweets = tweets.filter((tweet) => tweet.bApproved);
    const archivedTweets = tweets.filter((tweet) => tweet.bArchived);
    const onScreenTweets = tweets.filter((tweet) => tweet.bOnScreen);

    return (
        <div className={className}>
            <Card shadow="sm">
                <CardBody>
                    <div className="flex gap-8 p-4">
                        <CardCounter label="TOTAL" count={tweets.length} color="primary" />
                        <CardCounter label="APPROVED" count={approvedTweets.length} color="success" />
                        <CardCounter label="ARCHIVED" count={archivedTweets.length} color="warning" />
                        <CardCounter label="ON SCREEN" count={onScreenTweets.length} color="secondary"  />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}