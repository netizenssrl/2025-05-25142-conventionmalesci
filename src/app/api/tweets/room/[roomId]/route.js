import { NextResponse } from "next/server";
import { getTweetsByRoomId } from "@/actions/tweet";

export async function GET(req, {params}) {
    const {roomId} = await params;
    try {
        const tweets = await getTweetsByRoomId(roomId !== "all" ? roomId : null);
        return NextResponse.json(tweets, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}