import { NextResponse } from "next/server";
import { createTweet } from "@/actions/tweet";
export async function POST(req) {
    const body = await req.json();
    if(body.sTextOriginal && body.participantId) {
        const tweet = await createTweet(body);
        return NextResponse.json(tweet, { status: 201 });
    }
}