import { NextResponse } from "next/server";
import { getTweetsByParticipantId } from "@/actions/tweet";

export async function GET(req, {params}) {
    const { participantId } = await params;
    try {
        const tweets = await getTweetsByParticipantId(participantId);
        return NextResponse.json(tweets, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}