import { NextResponse } from "next/server";
import { createParticipantAnswer } from "@/actions/participant";

export async function POST(req) {
    const body = await req.json();
    if(body.participantId && body.votingSessionId && body.answerId) {
        
        const participantAnswer = await createParticipantAnswer(body);
        return NextResponse.json(participantAnswer, { status: 201 });
    }
}

